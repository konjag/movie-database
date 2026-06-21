import { renderHook, act } from "@testing-library/react";
import { useFavourites } from "./use-favourites";

const mockMovie = {
  imdbID: "tt1375666",
  Title: "Inception",
  Year: "2010",
  Type: "movie",
  Poster: "N/A",
};

const mockMovie2 = {
  imdbID: "tt0137523",
  Title: "Fight Club",
  Year: "1999",
  Type: "movie",
  Poster: "N/A",
};

function cleanupFavourites() {
  const { result, unmount } = renderHook(() => useFavourites());
  act(() => {
    result.current.favourites.forEach((movie) => {
      result.current.removeFavourite(movie.imdbID);
    });
  });
  unmount();
}

describe("useFavourites", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanupFavourites();
    localStorage.clear();
  });

  it("starts with empty favourites", () => {
    const { result } = renderHook(() => useFavourites());

    expect(result.current.favourites).toEqual([]);
    expect(result.current.isFavourite(mockMovie.imdbID)).toBe(false);
  });

  it("adds a favourite", () => {
    const { result } = renderHook(() => useFavourites());

    act(() => {
      result.current.addFavourite(mockMovie);
    });

    expect(result.current.favourites).toHaveLength(1);
    expect(result.current.isFavourite(mockMovie.imdbID)).toBe(true);
  });

  it("does not add duplicate favourites", () => {
    const { result } = renderHook(() => useFavourites());

    act(() => {
      result.current.addFavourite(mockMovie);
      result.current.addFavourite(mockMovie);
    });

    expect(result.current.favourites).toHaveLength(1);
  });

  it("removes a favourite", () => {
    const { result } = renderHook(() => useFavourites());

    act(() => {
      result.current.addFavourite(mockMovie);
    });
    expect(result.current.favourites).toHaveLength(1);

    act(() => {
      result.current.removeFavourite(mockMovie.imdbID);
    });

    expect(result.current.favourites).toEqual([]);
    expect(result.current.isFavourite(mockMovie.imdbID)).toBe(false);
  });

  it("toggles a favourite", () => {
    const { result } = renderHook(() => useFavourites());

    act(() => {
      result.current.toggleFavourite(mockMovie);
    });
    expect(result.current.isFavourite(mockMovie.imdbID)).toBe(true);

    act(() => {
      result.current.toggleFavourite(mockMovie);
    });
    expect(result.current.isFavourite(mockMovie.imdbID)).toBe(false);
  });

  it("persists favourites across hook instances", () => {
    const { result: first, unmount: unmountFirst } = renderHook(() => useFavourites());

    act(() => {
      first.current.addFavourite(mockMovie);
    });
    act(() => {
      first.current.addFavourite(mockMovie2);
    });
    expect(first.current.favourites).toHaveLength(2);
    unmountFirst();

    const { result: second } = renderHook(() => useFavourites());

    expect(second.current.favourites).toHaveLength(2);
    expect(second.current.isFavourite(mockMovie.imdbID)).toBe(true);
    expect(second.current.isFavourite(mockMovie2.imdbID)).toBe(true);
  });

  it("clears error state", () => {
    const { result } = renderHook(() => useFavourites());

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});
