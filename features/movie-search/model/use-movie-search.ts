"use client";

import { useCallback, useState } from "react";
import {
  MovieSearchResult,
  PaginationMeta,
  SearchMoviesParams,
} from "@/entities/movie/model/types";
import { searchMovies } from "@/entities/movie/api/omdb";

interface UseMovieSearchState {
  results: MovieSearchResult[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationMeta;
}

interface UseMovieSearchReturn extends UseMovieSearchState {
  executeSearch: (params: SearchMoviesParams) => Promise<void>;
  reset: () => void;
}

const EMPTY_PAGINATION: PaginationMeta = {
  currentPage: 1,
  totalPages: 0,
  totalResults: 0,
};

export function useMovieSearch(): UseMovieSearchReturn {
  const [state, setState] = useState<UseMovieSearchState>({
    results: [],
    isLoading: false,
    error: null,
    pagination: EMPTY_PAGINATION,
  });

  const executeSearch = useCallback(async (params: SearchMoviesParams) => {
    setState((current) => ({ ...current, isLoading: true, error: null }));

    try {
      const data = await searchMovies(params);

      if (data.Response === "False") {
        setState({
          results: [],
          isLoading: false,
          error: data.Error ?? "No results found",
          pagination: EMPTY_PAGINATION,
        });
        return;
      }

      const totalResults = Number(data.totalResults ?? 0);
      const totalPages = Math.ceil(totalResults / 10);

      setState({
        results: data.Search ?? [],
        isLoading: false,
        error: null,
        pagination: {
          currentPage: params.page ?? 1,
          totalPages,
          totalResults,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      setState({
        results: [],
        isLoading: false,
        error: message,
        pagination: EMPTY_PAGINATION,
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      results: [],
      isLoading: false,
      error: null,
      pagination: EMPTY_PAGINATION,
    });
  }, []);

  return {
    ...state,
    executeSearch,
    reset,
  };
}
