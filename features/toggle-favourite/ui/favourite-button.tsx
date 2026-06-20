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
  const { isFavourite, toggleFavourite } = useFavourites();
  const active = isFavourite(movie.imdbID);

  return (
    <button
      type="button"
      onClick={() => toggleFavourite(movie)}
      aria-label={active ? "Remove from favourites" : "Add to favourites"}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-2 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        active
          ? "bg-red-50 text-red-600 hover:bg-red-100"
          : "bg-muted/10 text-muted hover:bg-muted/20 hover:text-foreground",
        className
      )}
    >
      <Heart className="h-5 w-5" fill={active ? "currentColor" : "none"} aria-hidden="true" />
    </button>
  );
}
