import { render, screen } from "@testing-library/react";
import { MovieCard } from "./movie-card";

const mockMovie = {
  imdbID: "tt1375666",
  Title: "Inception",
  Year: "2010",
  Type: "movie",
  Poster: "N/A",
};

describe("MovieCard", () => {
  it("renders movie title and year", () => {
    render(<MovieCard movie={mockMovie} />);

    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText("2010")).toBeInTheDocument();
  });

  it("links to the movie details page", () => {
    render(<MovieCard movie={mockMovie} />);

    const links = screen.getAllByRole("link", { name: /Inception/i });
    expect(links[0]).toHaveAttribute("href", "/movie/tt1375666");
  });

  it("renders a placeholder when poster is N/A", () => {
    render(<MovieCard movie={mockMovie} />);

    expect(screen.getByText("No poster")).toBeInTheDocument();
  });

  it("renders an action when provided", () => {
    render(<MovieCard movie={mockMovie} action={<button type="button">Action</button>} />);

    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });
});
