import { render, screen } from "@testing-library/react";
import MoviePage from "./page";
import { notFoundMock } from "@/jest.setup";

const mockFetch = jest.fn();

const mockMovie = {
  imdbID: "tt1375666",
  Title: "Inception",
  Year: "2010",
  Rated: "PG-13",
  Released: "16 Jul 2010",
  Runtime: "148 min",
  Genre: "Action, Adventure, Sci-Fi",
  Director: "Christopher Nolan",
  Writer: "Christopher Nolan",
  Actors: "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page",
  Plot: "A thief who steals corporate secrets through dream-sharing technology.",
  Language: "English, Japanese, French",
  Country: "United States, United Kingdom",
  Awards: "Won 4 Oscars. 157 wins & 220 nominations total",
  Poster: "https://m.media-amazon.com/images/poster.jpg",
  Ratings: [{ Source: "Internet Movie Database", Value: "8.8/10" }],
  Metascore: "74",
  imdbRating: "8.8",
  imdbVotes: "2,500,000",
  Type: "movie",
  Response: "True",
};

describe("MoviePage", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = mockFetch as unknown as typeof fetch;
    process.env.OMDB_API_KEY = "test-api-key";
  });

  it("renders movie details when API returns a movie", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMovie,
    });

    const jsx = await MoviePage({ params: Promise.resolve({ id: "tt1375666" }) });
    render(jsx);

    expect(screen.getByRole("heading", { name: "Inception" })).toBeInTheDocument();
    expect(screen.getByText("2010 · PG-13 · 148 min")).toBeInTheDocument();
  });

  it("renders an error message when the API request fails", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const jsx = await MoviePage({ params: Promise.resolve({ id: "tt1375666" }) });
    render(jsx);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/Network error/i)).toBeInTheDocument();
  });

  it("calls notFound when the movie is not found", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ Response: "False", Error: "Movie not found!" }),
    });

    await MoviePage({ params: Promise.resolve({ id: "tt0000000" }) });

    expect(notFoundMock).toHaveBeenCalled();
  });
});
