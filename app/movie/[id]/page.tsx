import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MovieDetails } from "@/widgets/movie-details/ui/movie-details";
import { ErrorMessage } from "@/shared/ui/error-message";

const OMDB_API_URL = "https://www.omdbapi.com";

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

async function fetchMovieDetails(id: string) {
  const apiKey = process.env.OMDB_API_KEY;

  if (!apiKey) {
    throw new Error("OMDb API key is not configured");
  }

  const searchParams = new URLSearchParams();
  searchParams.set("apikey", apiKey);
  searchParams.set("i", id);
  searchParams.set("plot", "full");

  const response = await fetch(`${OMDB_API_URL}/?${searchParams.toString()}`, {
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`OMDb API returned status ${response.status}`);
  }

  return response.json();
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const movie = await fetchMovieDetails(id);
    if (movie.Response === "True") {
      return {
        title: `${movie.Title} (${movie.Year}) - Movie Database`,
        description: movie.Plot?.replace("N/A", "") || undefined,
      };
    }
  } catch {
    // Fall back to default metadata
  }

  return {
    title: "Movie Details - Movie Database",
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;

  let movie;
  try {
    movie = await fetchMovieDetails(id);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load movie details";
    return (
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <ErrorMessage title="Could not load movie details" message={message} />
      </main>
    );
  }

  if (movie.Response === "False") {
    notFound();
  }

  return (
    <main className="flex-1">
      <MovieDetails movie={movie} />
    </main>
  );
}
