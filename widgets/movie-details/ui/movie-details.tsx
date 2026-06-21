import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MovieDetails as MovieDetailsType } from "@/entities/movie/model/types";
import { FavouriteButton } from "@/features/toggle-favourite/ui/favourite-button";
import { cn } from "@/shared/lib/utils";

interface MovieDetailsProps {
  movie: MovieDetailsType;
  className?: string;
}

export function MovieDetails({ movie, className }: MovieDetailsProps) {
  const hasPoster = movie.Poster && movie.Poster !== "N/A" && movie.Poster.startsWith("http");

  const detailItems = [
    { label: "Released", value: movie.Released },
    { label: "Runtime", value: movie.Runtime },
    { label: "Genre", value: movie.Genre },
    { label: "Director", value: movie.Director },
    { label: "Writer", value: movie.Writer },
    { label: "Actors", value: movie.Actors },
    { label: "Language", value: movie.Language },
    { label: "Country", value: movie.Country },
    { label: "Awards", value: movie.Awards },
    { label: "Box Office", value: movie.BoxOffice },
    { label: "Production", value: movie.Production },
  ].filter((item) => item.value && item.value !== "N/A");

  const searchResult = {
    imdbID: movie.imdbID,
    Title: movie.Title,
    Year: movie.Year,
    Type: movie.Type,
    Poster: movie.Poster,
  };

  return (
    <article className={cn("mx-auto w-full max-w-5xl px-4 py-8", className)}>
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to search
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-[300px_1fr]">
        <div className="relative aspect-[2/3] w-full max-w-[300px] overflow-hidden rounded-lg border border-border bg-muted/20">
          {hasPoster ? (
            <Image
              src={movie.Poster}
              alt={`${movie.Title} poster`}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted">
              <span className="text-sm">No poster</span>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{movie.Title}</h1>
              <p className="mt-1 text-lg text-muted">
                {movie.Year} &middot; {movie.Rated} &middot; {movie.Runtime}
              </p>
            </div>
            <FavouriteButton movie={searchResult} />
          </div>

          {movie.imdbRating && movie.imdbRating !== "N/A" && (
            <div className="mt-4 flex items-center gap-2">
              <span className="rounded bg-yellow-100 px-2 py-1 text-sm font-semibold text-yellow-800">
                IMDb {movie.imdbRating}/10
              </span>
              {movie.imdbVotes && movie.imdbVotes !== "N/A" && (
                <span className="text-sm text-muted">({movie.imdbVotes} votes)</span>
              )}
            </div>
          )}

          {movie.Plot && movie.Plot !== "N/A" && (
            <section className="mt-6">
              <h2 className="text-lg font-semibold">Plot</h2>
              <p className="mt-2 leading-relaxed text-foreground">{movie.Plot}</p>
            </section>
          )}

          <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            {detailItems.map(({ label, value }) => (
              <div key={label}>
                <dt className="text-sm font-medium text-muted">{label}</dt>
                <dd className="mt-0.5 text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </article>
  );
}
