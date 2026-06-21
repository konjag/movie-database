import { renderHook, act } from "@testing-library/react";
import { useMovieFilters, GENRE_OPTIONS } from "./use-movie-filters";

describe("useMovieFilters", () => {
  it("initializes with empty filters", () => {
    const { result } = renderHook(() => useMovieFilters());

    expect(result.current.filters).toEqual({ year: "", genre: "" });
  });

  it("accepts initial filters", () => {
    const { result } = renderHook(() => useMovieFilters({ year: "2010", genre: "Action" }));

    expect(result.current.filters).toEqual({ year: "2010", genre: "Action" });
  });

  it("updates year", () => {
    const { result } = renderHook(() => useMovieFilters());

    act(() => {
      result.current.setYear("2010");
    });

    expect(result.current.filters.year).toBe("2010");
  });

  it("updates genre", () => {
    const { result } = renderHook(() => useMovieFilters());

    act(() => {
      result.current.setGenre("Drama");
    });

    expect(result.current.filters.genre).toBe("Drama");
  });

  it("resets filters", () => {
    const { result } = renderHook(() => useMovieFilters({ year: "2010", genre: "Action" }));

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.filters).toEqual({ year: "", genre: "" });
  });

  it("exposes a list of genre options", () => {
    expect(GENRE_OPTIONS).toContain("Action");
    expect(GENRE_OPTIONS).toContain("Drama");
  });
});
