"use client";

import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { cn } from "@/shared/lib/utils";

interface SearchFormProps {
  defaultValue?: string;
  onSearch: (query: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function SearchForm({ defaultValue = "", onSearch, isLoading, className }: SearchFormProps) {
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    onSearch(trimmedQuery);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-2 sm:flex-row", className)}
      role="search"
    >
      <div className="flex-1">
        <Label htmlFor="movie-search" className="sr-only">
          Search movies
        </Label>
        <Input
          id="movie-search"
          type="search"
          placeholder="Search for a movie..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          disabled={isLoading}
          autoComplete="off"
        />
      </div>
      <Button type="submit" disabled={isLoading || !query.trim()}>
        <Search className="mr-2 h-4 w-4" aria-hidden="true" />
        Search
      </Button>
    </form>
  );
}
