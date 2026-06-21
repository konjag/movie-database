import { renderHook, act } from "@testing-library/react";
import { useMovieSearch } from "./use-movie-search";
import { searchMovies } from "../../../entities/movie/api/omdb";

jest.mock("../../../entities/movie/api/omdb");

const mockSearchMovies = searchMovies as jest.Mock;

describe("useMovieSearch", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("starts with empty results and no loading state", () => {
    const { result } = renderHook(() => useMovieSearch());

    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("loads search results", async () => {
    mockSearchMovies.mockResolvedValueOnce({
      Response: "True",
      Search: [
        {
          imdbID: "tt1375666",
          Title: "Inception",
          Year: "2010",
          Type: "movie",
          Poster: "N/A",
        },
      ],
      totalResults: "1",
    });

    const { result } = renderHook(() => useMovieSearch());

    await act(async () => {
      await result.current.executeSearch({ query: "Inception" });
    });

    expect(result.current.results).toHaveLength(1);
    expect(result.current.results[0].Title).toBe("Inception");
    expect(result.current.pagination.totalPages).toBe(1);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("sets an error when the search fails", async () => {
    mockSearchMovies.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useMovieSearch());

    await act(async () => {
      await result.current.executeSearch({ query: "Inception" });
    });

    expect(result.current.error).toBe("Network error");
    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it("handles API error response", async () => {
    mockSearchMovies.mockResolvedValueOnce({
      Response: "False",
      Error: "Movie not found!",
    });

    const { result } = renderHook(() => useMovieSearch());

    await act(async () => {
      await result.current.executeSearch({ query: "xyz" });
    });

    expect(result.current.error).toBe("Movie not found!");
    expect(result.current.results).toEqual([]);
  });

  it("resets state", async () => {
    mockSearchMovies.mockResolvedValueOnce({
      Response: "True",
      Search: [
        {
          imdbID: "tt1375666",
          Title: "Inception",
          Year: "2010",
          Type: "movie",
          Poster: "N/A",
        },
      ],
      totalResults: "1",
    });

    const { result } = renderHook(() => useMovieSearch());

    await act(async () => {
      await result.current.executeSearch({ query: "Inception" });
    });
    expect(result.current.results).toHaveLength(1);

    act(() => {
      result.current.reset();
    });

    expect(result.current.results).toEqual([]);
    expect(result.current.error).toBeNull();
  });
});
