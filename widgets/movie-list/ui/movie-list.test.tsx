import { render, screen } from "@testing-library/react";
import { MovieList } from "./movie-list";

const mockMovies = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Type: "movie",
    Poster: "N/A",
  },
  {
    imdbID: "tt0137523",
    Title: "Fight Club",
    Year: "1999",
    Type: "movie",
    Poster: "N/A",
  },
];

describe("MovieList", () => {
  it("renders a list of movies", () => {
    render(<MovieList movies={mockMovies} />);

    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText("Fight Club")).toBeInTheDocument();
  });

  it("renders an empty state when no movies are provided", () => {
    render(<MovieList movies={[]} />);

    expect(screen.getByRole("heading", { name: "No movies found" })).toBeInTheDocument();
  });

  it("uses a custom empty state", () => {
    render(
      <MovieList movies={[]} emptyTitle="No favourites" emptyDescription="Add some movies first." />
    );

    expect(screen.getByRole("heading", { name: "No favourites" })).toBeInTheDocument();
    expect(screen.getByText("Add some movies first.")).toBeInTheDocument();
  });
});
