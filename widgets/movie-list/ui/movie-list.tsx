import { MovieSearchResult } from "@/entities/movie/model/types";
import { MovieCard } from "@/entities/movie/ui/movie-card";
import { FavouriteButton } from "@/features/toggle-favourite/ui/favourite-button";
import { EmptyState } from "@/shared/ui/empty-state";
import { cn } from "@/shared/lib/utils";

interface MovieListProps {
  movies: MovieSearchResult[];
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

export function MovieList({
  movies,
  emptyTitle = "No movies found",
  emptyDescription = "Try adjusting your search or filters.",
  className,
}: MovieListProps) {
  if (movies.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} className="my-8" />;
  }

  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
        className
      )}
      aria-label="Movie results"
    >
      {movies.map((movie) => (
        <li key={movie.imdbID}>
          <MovieCard movie={movie} action={<FavouriteButton movie={movie} className="w-full" />} />
        </li>
      ))}
    </ul>
  );
}
