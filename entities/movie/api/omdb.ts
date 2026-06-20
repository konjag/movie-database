import {
  MovieDetails,
  MovieDetailsResponse,
  MovieSearchResponse,
  SearchMoviesParams,
} from "@/entities/movie/model/types";

export class OmdbApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "OmdbApiError";
  }
}

export async function searchMovies({
  query,
  page = 1,
  year,
}: SearchMoviesParams): Promise<MovieSearchResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set("query", query);
  searchParams.set("page", String(page));
  if (year) {
    searchParams.set("year", String(year));
  }

  const response = await fetch(`/api/movies?${searchParams.toString()}`);

  if (!response.ok) {
    throw new OmdbApiError(`Failed to search movies: ${response.statusText}`, response.status);
  }

  return response.json();
}

export async function getMovieDetails(id: string): Promise<MovieDetails | null> {
  const response = await fetch(`/api/movies?id=${encodeURIComponent(id)}`);

  if (!response.ok) {
    throw new OmdbApiError(
      `Failed to fetch movie details: ${response.statusText}`,
      response.status
    );
  }

  const data = (await response.json()) as MovieDetailsResponse & MovieDetails;

  if (data.Response === "False") {
    return null;
  }

  return data;
}
