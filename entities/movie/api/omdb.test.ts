import { searchMovies, getMovieDetails, OmdbApiError } from "./omdb";

const mockFetch = jest.fn();

describe("omdb API client", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = mockFetch as unknown as typeof fetch;
  });

  describe("searchMovies", () => {
    it("calls the movies route with query and page", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          Response: "True",
          Search: [],
          totalResults: "0",
        }),
      });

      await searchMovies({ query: "Inception", page: 2, year: 2010 });

      expect(mockFetch).toHaveBeenCalledWith("/api/movies?query=Inception&page=2&year=2010");
    });

    it("throws OmdbApiError when response is not ok", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Internal Server Error",
        status: 500,
      });

      await expect(searchMovies({ query: "Inception" })).rejects.toThrow(OmdbApiError);
    });
  });

  describe("getMovieDetails", () => {
    it("calls the movies route with id", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          imdbID: "tt1375666",
          Title: "Inception",
          Response: "True",
        }),
      });

      const result = await getMovieDetails("tt1375666");

      expect(mockFetch).toHaveBeenCalledWith("/api/movies?id=tt1375666");
      expect(result).toMatchObject({ Title: "Inception" });
    });

    it("returns null when movie is not found", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          Response: "False",
          Error: "Movie not found!",
        }),
      });

      const result = await getMovieDetails("tt0000000");

      expect(result).toBeNull();
    });

    it("throws OmdbApiError when response is not ok", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Not Found",
        status: 404,
      });

      await expect(getMovieDetails("tt0000000")).rejects.toThrow(OmdbApiError);
    });
  });
});
