"use client";

import { useCallback, useState } from "react";
import { MovieDetails, MovieSearchResult } from "@/entities/movie/model/types";
import { getMovieDetails } from "@/entities/movie/api/omdb";

interface UseFilteredMoviesState {
  movies: MovieSearchResult[];
  isLoading: boolean;
  error: string | null;
}

interface UseFilteredMoviesReturn extends UseFilteredMoviesState {
  applyGenreFilter: (movies: MovieSearchResult[], genre: string) => Promise<void>;
  reset: () => void;
}

function matchesGenre(details: MovieDetails, genre: string): boolean {
  if (!details.Genre) return false;
  return details.Genre.split(",").some((g) => g.trim().toLowerCase() === genre.toLowerCase());
}

export function useFilteredMovies(): UseFilteredMoviesReturn {
  const [state, setState] = useState<UseFilteredMoviesState>({
    movies: [],
    isLoading: false,
    error: null,
  });

  const applyGenreFilter = useCallback(async (movies: MovieSearchResult[], genre: string) => {
    if (!genre) {
      setState({ movies, isLoading: false, error: null });
      return;
    }

    setState({ movies: [], isLoading: true, error: null });

    try {
      const detailRequests = movies.map(async (movie) => {
        const details = await getMovieDetails(movie.imdbID);
        return { movie, details };
      });

      const results = await Promise.all(detailRequests);
      const filtered = results
        .filter(({ details }) => details && matchesGenre(details, genre))
        .map(({ movie }) => movie);

      setState({
        movies: filtered,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to apply genre filter";
      setState({
        movies: [],
        isLoading: false,
        error: message,
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ movies: [], isLoading: false, error: null });
  }, []);

  return {
    ...state,
    applyGenreFilter,
    reset,
  };
}
