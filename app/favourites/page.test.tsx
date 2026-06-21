import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FavouritesPage from "./page";

jest.mock("../../features/toggle-favourite/model/use-favourites", () => ({
  useFavourites: jest.fn(),
}));

const { useFavourites } = jest.requireMock(
  "../../features/toggle-favourite/model/use-favourites"
) as { useFavourites: jest.Mock };

const mockRemoveFavourite = jest.fn();

describe("FavouritesPage", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders empty state when there are no favourites", () => {
    useFavourites.mockReturnValue({
      favourites: [],
      error: null,
      isReady: true,
      isFavourite: jest.fn(),
      addFavourite: jest.fn(),
      removeFavourite: mockRemoveFavourite,
      toggleFavourite: jest.fn(),
      clearError: jest.fn(),
    });

    render(<FavouritesPage />);

    expect(screen.getByRole("heading", { name: "Favourites" })).toBeInTheDocument();
    expect(screen.getByText(/No favourites yet/i)).toBeInTheDocument();
  });

  it("renders a list of favourite movies", () => {
    useFavourites.mockReturnValue({
      favourites: [
        {
          imdbID: "tt1375666",
          Title: "Inception",
          Year: "2010",
          Type: "movie",
          Poster: "https://m.media-amazon.com/images/poster.jpg",
        },
      ],
      error: null,
      isReady: true,
      isFavourite: jest.fn(),
      addFavourite: jest.fn(),
      removeFavourite: mockRemoveFavourite,
      toggleFavourite: jest.fn(),
      clearError: jest.fn(),
    });

    render(<FavouritesPage />);

    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText("1 movie saved")).toBeInTheDocument();
  });

  it("calls removeFavourite when the remove button is clicked", async () => {
    useFavourites.mockReturnValue({
      favourites: [
        {
          imdbID: "tt1375666",
          Title: "Inception",
          Year: "2010",
          Type: "movie",
          Poster: "https://m.media-amazon.com/images/poster.jpg",
        },
      ],
      error: null,
      isReady: true,
      isFavourite: jest.fn(),
      addFavourite: jest.fn(),
      removeFavourite: mockRemoveFavourite,
      toggleFavourite: jest.fn(),
      clearError: jest.fn(),
    });

    render(<FavouritesPage />);

    const removeButton = screen.getByRole("button", { name: /Remove/i });
    await userEvent.click(removeButton);

    expect(mockRemoveFavourite).toHaveBeenCalledWith("tt1375666");
  });
});
