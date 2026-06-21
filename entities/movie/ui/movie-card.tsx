"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MovieSearchResult } from "@/entities/movie/model/types";
import { cn } from "@/shared/lib/utils";

interface MovieCardProps {
  movie: MovieSearchResult;
  className?: string;
  action?: React.ReactNode;
}

export function MovieCard({ movie, className, action }: MovieCardProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const hasPosterUrl = movie.Poster && movie.Poster !== "N/A" && movie.Poster.startsWith("http");
  const showPoster = hasPosterUrl && !hasImageError;

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-background transition-shadow hover:shadow-md",
        className
      )}
    >
      <Link
        href={`/movie/${movie.imdbID}`}
        className="relative aspect-[2/3] overflow-hidden bg-muted/20"
        aria-label={`View details for ${movie.Title}`}
      >
        {showPoster ? (
          <Image
            src={movie.Poster}
            alt={`${movie.Title} poster`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setHasImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted/30 text-muted">
            <span className="text-sm">No poster</span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 min-h-[2.5em] font-semibold leading-tight">
          <Link
            href={`/movie/${movie.imdbID}`}
            className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {movie.Title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted">{movie.Year}</p>
        {action && <div className="mt-auto pt-3">{action}</div>}
      </div>
    </article>
  );
}
