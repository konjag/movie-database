import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FavouriteButton } from "./favourite-button";
import { useFavourites } from "../model/use-favourites";

jest.mock("../model/use-favourites");

const mockUseFavourites = useFavourites as jest.Mock;

const mockMovie = {
  imdbID: "tt1375666",
  Title: "Inception",
  Year: "2010",
  Type: "movie",
  Poster: "N/A",
};

describe("FavouriteButton", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders add label when movie is not a favourite", () => {
    mockUseFavourites.mockReturnValue({
      isFavourite: () => false,
      toggleFavourite: jest.fn(),
      error: null,
      clearError: jest.fn(),
    });

    render(<FavouriteButton movie={mockMovie} />);

    expect(screen.getByRole("button", { name: "Add to favourites" })).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });

  it("renders remove label when movie is a favourite", () => {
    mockUseFavourites.mockReturnValue({
      isFavourite: () => true,
      toggleFavourite: jest.fn(),
      error: null,
      clearError: jest.fn(),
    });

    render(<FavouriteButton movie={mockMovie} />);

    expect(screen.getByRole("button", { name: "Remove from favourites" })).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("calls toggleFavourite and clearError on click", async () => {
    const toggleFavourite = jest.fn();
    const clearError = jest.fn();

    mockUseFavourites.mockReturnValue({
      isFavourite: () => false,
      toggleFavourite,
      error: null,
      clearError,
    });

    render(<FavouriteButton movie={mockMovie} />);

    await userEvent.click(screen.getByRole("button"));

    expect(clearError).toHaveBeenCalled();
    expect(toggleFavourite).toHaveBeenCalledWith(mockMovie);
  });

  it("displays error message when saving fails", () => {
    mockUseFavourites.mockReturnValue({
      isFavourite: () => false,
      toggleFavourite: jest.fn(),
      error: "Could not save favourites. They may not persist.",
      clearError: jest.fn(),
    });

    render(<FavouriteButton movie={mockMovie} />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Could not save favourites. They may not persist."
    );
  });
});
