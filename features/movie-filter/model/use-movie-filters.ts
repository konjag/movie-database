"use client";

import { useCallback, useState } from "react";

export interface MovieFilters {
  year: string;
  genre: string;
}

export const GENRE_OPTIONS = [
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Film-Noir",
  "History",
  "Horror",
  "Music",
  "Musical",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Sport",
  "Thriller",
  "War",
  "Western",
];

export function useMovieFilters(initial: MovieFilters = { year: "", genre: "" }) {
  const [filters, setFilters] = useState<MovieFilters>(initial);

  const setYear = useCallback((year: string) => {
    setFilters((current) => ({ ...current, year }));
  }, []);

  const setGenre = useCallback((genre: string) => {
    setFilters((current) => ({ ...current, genre }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ year: "", genre: "" });
  }, []);

  return {
    filters,
    setYear,
    setGenre,
    resetFilters,
  };
}
