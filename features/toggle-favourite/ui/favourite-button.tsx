"use client";

import { Heart } from "lucide-react";
import { MovieSearchResult } from "@/entities/movie/model/types";
import { useFavourites } from "@/features/toggle-favourite/model/use-favourites";
import { cn } from "@/shared/lib/utils";

interface FavouriteButtonProps {
  movie: MovieSearchResult;
  className?: string;
}

export function FavouriteButton({ movie, className }: FavouriteButtonProps) {
  const { isFavourite, toggleFavourite, error, clearError } = useFavourites();
  const active = isFavourite(movie.imdbID);

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <button
        type="button"
        onClick={() => {
          clearError();
          toggleFavourite(movie);
        }}
        aria-label={active ? "Remove from favourites" : "Add to favourites"}
        aria-pressed={active}
        className={cn(
          "inline-flex items-center justify-center rounded-md p-2 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          active
            ? "bg-red-50 text-red-600 hover:bg-red-100"
            : "bg-muted/10 text-muted hover:bg-muted/20 hover:text-foreground"
        )}
      >
        <Heart className="h-5 w-5" fill={active ? "currentColor" : "none"} aria-hidden="true" />
      </button>
      {error && (
        <span className="text-xs text-red-600" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
