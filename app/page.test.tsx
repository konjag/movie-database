import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "./page";

const mockFetch = jest.fn();

describe("HomePage", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = mockFetch as unknown as typeof fetch;
  });

  it("renders the search form and empty state", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: /Discover movies/i })).toBeInTheDocument();
    expect(screen.getByRole("search")).toBeInTheDocument();
    expect(screen.getByText(/Start your search/i)).toBeInTheDocument();
  });

  it("performs a search and displays results", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        Response: "True",
        Search: [
          {
            imdbID: "tt1375666",
            Title: "Inception",
            Year: "2010",
            Type: "movie",
            Poster: "https://example.com/poster.jpg",
          },
        ],
        totalResults: "1",
      }),
    });

    render(<HomePage />);

    const searchInput = screen.getByPlaceholderText(/Search for a movie/i);
    const searchButton = screen.getByRole("button", { name: /Search/i });

    await userEvent.type(searchInput, "Inception");
    await userEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText("Inception")).toBeInTheDocument();
    });

    expect(screen.getByText("2010")).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("/api/movies?query=Inception"));
  });

  it("displays an error message when the search fails", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<HomePage />);

    const searchInput = screen.getByPlaceholderText(/Search for a movie/i);
    const searchButton = screen.getByRole("button", { name: /Search/i });

    await userEvent.type(searchInput, "Inception");
    await userEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    expect(screen.getByText(/Network error/i)).toBeInTheDocument();
  });

  it("displays a no-results message when the API returns no matches", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        Response: "False",
        Error: "Movie not found!",
      }),
    });

    render(<HomePage />);

    const searchInput = screen.getByPlaceholderText(/Search for a movie/i);
    const searchButton = screen.getByRole("button", { name: /Search/i });

    await userEvent.type(searchInput, "xyznonexistent");
    await userEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/Movie not found/i)).toBeInTheDocument();
    });
  });
});
