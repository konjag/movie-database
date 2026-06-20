"use client";

import { useCallback, useEffect, useState } from "react";
import { useMovieSearch } from "@/features/movie-search/model/use-movie-search";
import { SearchForm } from "@/features/movie-search/ui/search-form";
import { useMovieFilters } from "@/features/movie-filter/model/use-movie-filters";
import { useFilteredMovies } from "@/features/movie-filter/model/use-filtered-movies";
import { FilterForm } from "@/features/movie-filter/ui/filter-form";
import { Pagination } from "@/features/movie-pagination/ui/pagination";
import { MovieList } from "@/widgets/movie-list/ui/movie-list";
import { Spinner } from "@/shared/ui/spinner";
import { ErrorMessage } from "@/shared/ui/error-message";
import { EmptyState } from "@/shared/ui/empty-state";

export default function HomePage() {
  const { filters, setYear, setGenre, resetFilters } = useMovieFilters();
  const { results, isLoading, error, pagination, executeSearch } = useMovieSearch();
  const {
    movies: genreFilteredMovies,
    isLoading: isFilteringGenre,
    error: genreFilterError,
    applyGenreFilter,
    reset: resetGenreFilter,
  } = useFilteredMovies();

  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState("");

  const handleSearch = useCallback(
    async (query: string, page = 1) => {
      setLastSearchQuery(query);
      setActiveGenre("");
      resetGenreFilter();
      await executeSearch({ query, page, year: filters.year ? Number(filters.year) : undefined });
    },
    [executeSearch, filters.year, resetGenreFilter]
  );

  const handleApplyFilters = useCallback(async () => {
    if (!lastSearchQuery) return;

    setActiveGenre(filters.genre);
    resetGenreFilter();

    await executeSearch({
      query: lastSearchQuery,
      page: 1,
      year: filters.year ? Number(filters.year) : undefined,
    });
  }, [executeSearch, filters, lastSearchQuery, resetGenreFilter]);

  const handleResetFilters = useCallback(() => {
    resetFilters();
    setActiveGenre("");
    resetGenreFilter();
    if (lastSearchQuery) {
      executeSearch({ query: lastSearchQuery, page: 1 });
    }
  }, [resetFilters, resetGenreFilter, lastSearchQuery, executeSearch]);

  const handlePageChange = useCallback(
    async (page: number) => {
      if (!lastSearchQuery) return;

      setActiveGenre("");
      resetGenreFilter();

      await executeSearch({
        query: lastSearchQuery,
        page,
        year: filters.year ? Number(filters.year) : undefined,
      });
    },
    [executeSearch, filters.year, lastSearchQuery, resetGenreFilter]
  );

  useEffect(() => {
    if (results.length > 0 && activeGenre) {
      applyGenreFilter(results, activeGenre);
    }
  }, [results, activeGenre, applyGenreFilter]);

  const displayMovies = activeGenre ? genreFilteredMovies : results;
  const isBusy = isLoading || isFilteringGenre;
  const displayError = error || genreFilterError;

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Discover movies</h1>
      <p className="mt-2 text-muted">Search the OMDb database for your favourite films.</p>

      <div className="mt-8 space-y-6">
        <SearchForm onSearch={(query) => handleSearch(query)} isLoading={isBusy} />

        <FilterForm
          filters={filters}
          onYearChange={setYear}
          onGenreChange={setGenre}
          onSubmit={handleApplyFilters}
          onReset={handleResetFilters}
          isLoading={isBusy}
        />

        {activeGenre && (
          <p className="text-sm text-muted">
            Showing movies on this page that match the &quot;{activeGenre}&quot; genre.
          </p>
        )}

        {displayError && (
          <ErrorMessage
            title="Could not load movies"
            message={displayError}
            onRetry={() => handleSearch(lastSearchQuery || "", pagination.currentPage)}
            className="my-6"
          />
        )}

        {isBusy && <Spinner className="my-12" />}

        {!isBusy && !displayError && lastSearchQuery && displayMovies.length === 0 && (
          <EmptyState
            title="No movies found"
            description="Try a different search term or adjust your filters."
            className="my-8"
          />
        )}

        {!isBusy && !displayError && displayMovies.length > 0 && (
          <>
            <MovieList movies={displayMovies} className="mt-6" />
            {!activeGenre && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                className="mt-8"
              />
            )}
          </>
        )}

        {!isBusy && !lastSearchQuery && displayMovies.length === 0 && !displayError && (
          <EmptyState
            title="Start your search"
            description="Enter a movie title above to see results."
            className="my-8"
          />
        )}
      </div>
    </main>
  );
}
