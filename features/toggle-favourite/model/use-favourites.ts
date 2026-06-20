"use client";

import { useCallback, useSyncExternalStore } from "react";
import { MovieSearchResult } from "@/entities/movie/model/types";

const STORAGE_KEY = "movie-database-favourites";
const CHANGE_EVENT = "movie-database-favourites-change";

let cachedFavourites: MovieSearchResult[] | null = null;

function parseStoredFavourites(): MovieSearchResult[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function getFavourites(): MovieSearchResult[] {
  if (cachedFavourites === null) {
    cachedFavourites = parseStoredFavourites();
  }
  return cachedFavourites;
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

function saveFavourites(favourites: MovieSearchResult[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    cachedFavourites = favourites;
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Ignore localStorage errors
  }
}

export function useFavourites() {
  const favourites = useSyncExternalStore(subscribe, getFavourites, () => []);

  const addFavourite = useCallback(
    (movie: MovieSearchResult) => {
      const updated = favourites.some((item) => item.imdbID === movie.imdbID)
        ? favourites
        : [...favourites, movie];
      saveFavourites(updated);
    },
    [favourites]
  );

  const removeFavourite = useCallback(
    (id: string) => {
      const updated = favourites.filter((movie) => movie.imdbID !== id);
      saveFavourites(updated);
    },
    [favourites]
  );

  const toggleFavourite = useCallback(
    (movie: MovieSearchResult) => {
      const exists = favourites.some((item) => item.imdbID === movie.imdbID);
      const updated = exists
        ? favourites.filter((item) => item.imdbID !== movie.imdbID)
        : [...favourites, movie];
      saveFavourites(updated);
    },
    [favourites]
  );

  const isFavourite = useCallback(
    (id: string) => favourites.some((movie) => movie.imdbID === id),
    [favourites]
  );

  return {
    favourites,
    isReady: true,
    isFavourite,
    addFavourite,
    removeFavourite,
    toggleFavourite,
  };
}
