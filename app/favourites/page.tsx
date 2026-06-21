"use client";

import { MovieCard } from "@/entities/movie/ui/movie-card";
import { useFavourites } from "@/features/toggle-favourite/model/use-favourites";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { Spinner } from "@/shared/ui/spinner";
import { Trash2 } from "lucide-react";

export default function FavouritesPage() {
  const { favourites, isReady, removeFavourite } = useFavourites();

  if (!isReady) {
    return (
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Spinner className="my-12" />
      </main>
    );
  }

  if (favourites.length === 0) {
    return (
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <h1 className="text-2xl font-semibold tracking-tight">Favourites</h1>
        <EmptyState
          title="No favourites yet"
          description="Mark movies as favourites from the search results or details page to see them here."
          className="my-8"
        />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Favourites</h1>
      <p className="mt-2 text-muted">
        {favourites.length} {favourites.length === 1 ? "movie" : "movies"} saved
      </p>

      <ul
        className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        aria-label="Favourite movies"
      >
        {favourites.map((movie) => (
          <li key={movie.imdbID}>
            <MovieCard
              movie={movie}
              action={
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => removeFavourite(movie.imdbID)}
                >
                  <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                  Remove
                </Button>
              }
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
