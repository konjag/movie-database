import { render, screen } from "@testing-library/react";
import { MovieDetails } from "./movie-details";

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
  Ratings: [
    { Source: "Internet Movie Database", Value: "8.8/10" },
    { Source: "Rotten Tomatoes", Value: "87%" },
  ],
  Metascore: "74",
  imdbRating: "8.8",
  imdbVotes: "2,500,000",
  Type: "movie",
  DVD: "07 Dec 2010",
  BoxOffice: "$292,587,330",
  Production: "Warner Bros. Pictures",
  Website: "N/A",
  Response: "True" as const,
};

describe("MovieDetails", () => {
  it("renders movie title, year, rating, and plot", () => {
    render(<MovieDetails movie={mockMovie} />);

    expect(screen.getByRole("heading", { name: "Inception" })).toBeInTheDocument();
    expect(screen.getByText("2010 · PG-13 · 148 min")).toBeInTheDocument();
    expect(screen.getByText(/A thief who steals corporate secrets/i)).toBeInTheDocument();
    expect(screen.getByText(/IMDb 8.8\/10/i)).toBeInTheDocument();
  });

  it("renders detail fields", () => {
    render(<MovieDetails movie={mockMovie} />);

    expect(screen.getByText("148 min")).toBeInTheDocument();
    expect(screen.getByText("Action, Adventure, Sci-Fi")).toBeInTheDocument();
    expect(
      screen.getByText("Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page")
    ).toBeInTheDocument();
  });

  it("renders a back link", () => {
    render(<MovieDetails movie={mockMovie} />);

    expect(screen.getByRole("link", { name: /Back to search/i })).toHaveAttribute("href", "/");
  });

  it("renders a favourite button", () => {
    render(<MovieDetails movie={mockMovie} />);

    expect(screen.getByRole("button", { name: /Add to favourites/i })).toBeInTheDocument();
  });
});
