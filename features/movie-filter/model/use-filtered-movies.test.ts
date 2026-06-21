import { renderHook, waitFor, act } from "@testing-library/react";
import { useFilteredMovies } from "./use-filtered-movies";
import { getMovieDetails } from "../../../entities/movie/api/omdb";

jest.mock("../../../entities/movie/api/omdb");

const mockGetMovieDetails = getMovieDetails as jest.Mock;

const mockMovies = [
  {
    imdbID: "tt1",
    Title: "Action Movie",
    Year: "2010",
    Type: "movie",
    Poster: "N/A",
  },
  {
    imdbID: "tt2",
    Title: "Drama Movie",
    Year: "2015",
    Type: "movie",
    Poster: "N/A",
  },
];

describe("useFilteredMovies", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns all movies when genre is empty", async () => {
    const { result } = renderHook(() => useFilteredMovies());

    act(() => {
      result.current.applyGenreFilter(mockMovies, "");
    });

    await waitFor(() => {
      expect(result.current.movies).toEqual(mockMovies);
    });

    expect(mockGetMovieDetails).not.toHaveBeenCalled();
  });

  it("fetches details and filters by genre", async () => {
    mockGetMovieDetails
      .mockResolvedValueOnce({
        imdbID: "tt1",
        Genre: "Action, Thriller",
        Response: "True",
      })
      .mockResolvedValueOnce({
        imdbID: "tt2",
        Genre: "Drama",
        Response: "True",
      });

    const { result } = renderHook(() => useFilteredMovies());

    await act(async () => {
      await result.current.applyGenreFilter(mockMovies, "Action");
    });

    await waitFor(() => {
      expect(result.current.movies).toHaveLength(1);
    });

    expect(result.current.movies[0].Title).toBe("Action Movie");
  });

  it("sets an error when detail fetching fails", async () => {
    mockGetMovieDetails.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useFilteredMovies());

    await act(async () => {
      await result.current.applyGenreFilter(mockMovies, "Action");
    });

    await waitFor(() => {
      expect(result.current.error).toBe("Network error");
    });
  });
});
