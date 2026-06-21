"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { MovieSearchResult } from "@/entities/movie/model/types";

const STORAGE_KEY = "movie-database-favourites";
const CHANGE_EVENT = "movie-database-favourites-change";
const EMPTY_FAVOURITES: MovieSearchResult[] = [];

let cachedFavourites: MovieSearchResult[] | null = null;

function parseStoredFavourites(): MovieSearchResult[] {
  if (typeof window === "undefined") return EMPTY_FAVOURITES;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as MovieSearchResult[]) : EMPTY_FAVOURITES;
  } catch {
    return EMPTY_FAVOURITES;
  }
}

function getFavourites(): MovieSearchResult[] {
  if (cachedFavourites === null) {
    cachedFavourites = parseStoredFavourites();
  }
  return cachedFavourites;
}

function getServerSnapshot(): MovieSearchResult[] {
  return EMPTY_FAVOURITES;
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => {
    cachedFavourites = parseStoredFavourites();
    callback();
  };
  window.addEventListener(CHANGE_EVENT, handler);
  return () => window.removeEventListener(CHANGE_EVENT, handler);
}

function saveFavourites(favourites: MovieSearchResult[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    cachedFavourites = favourites;
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return true;
  } catch {
    return false;
  }
}

export function useFavourites() {
  const [error, setError] = useState<string | null>(null);
  const favourites = useSyncExternalStore(subscribe, getFavourites, getServerSnapshot);

  const clearError = useCallback(() => setError(null), []);

  const persistFavourites = useCallback((updated: MovieSearchResult[]) => {
    const success = saveFavourites(updated);
    if (!success) {
      setError("Could not save favourites. They may not persist.");
    } else {
      setError(null);
    }
  }, []);

  const addFavourite = useCallback(
    (movie: MovieSearchResult) => {
      const updated = favourites.some((item) => item.imdbID === movie.imdbID)
        ? favourites
        : [...favourites, movie];
      persistFavourites(updated);
    },
    [favourites, persistFavourites]
  );

  const removeFavourite = useCallback(
    (id: string) => {
      const updated = favourites.filter((movie) => movie.imdbID !== id);
      persistFavourites(updated);
    },
    [favourites, persistFavourites]
  );

  const toggleFavourite = useCallback(
    (movie: MovieSearchResult) => {
      const exists = favourites.some((item) => item.imdbID === movie.imdbID);
      const updated = exists
        ? favourites.filter((item) => item.imdbID !== movie.imdbID)
        : [...favourites, movie];
      persistFavourites(updated);
    },
    [favourites, persistFavourites]
  );

  const isFavourite = useCallback(
    (id: string) => favourites.some((movie) => movie.imdbID === id),
    [favourites]
  );

  return {
    favourites,
    error,
    isReady: true,
    isFavourite,
    addFavourite,
    removeFavourite,
    toggleFavourite,
    clearError,
  };
}
