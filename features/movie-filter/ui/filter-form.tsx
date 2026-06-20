"use client";

import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { GENRE_OPTIONS, MovieFilters } from "@/features/movie-filter/model/use-movie-filters";
import { cn } from "@/shared/lib/utils";

interface FilterFormProps {
  filters: MovieFilters;
  onYearChange: (year: string) => void;
  onGenreChange: (genre: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  isLoading?: boolean;
  className?: string;
}

export function FilterForm({
  filters,
  onYearChange,
  onGenreChange,
  onSubmit,
  onReset,
  isLoading,
  className,
}: FilterFormProps) {
  const hasActiveFilters = filters.year || filters.genre;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className={cn("flex flex-col gap-4 sm:flex-row sm:items-end", className)}
    >
      <div className="flex flex-col gap-1.5 sm:w-40">
        <Label htmlFor="year-filter">Year</Label>
        <Input
          id="year-filter"
          type="number"
          min="1900"
          max={new Date().getFullYear()}
          placeholder="e.g. 2010"
          value={filters.year}
          onChange={(event) => onYearChange(event.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-col gap-1.5 sm:w-48">
        <Label htmlFor="genre-filter">Genre</Label>
        <select
          id="genre-filter"
          value={filters.genre}
          onChange={(event) => onGenreChange(event.target.value)}
          disabled={isLoading}
          className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">All genres</option>
          {GENRE_OPTIONS.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          Apply filters
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onReset}
          disabled={isLoading || !hasActiveFilters}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
