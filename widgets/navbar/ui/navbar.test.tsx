import { render, screen } from "@testing-library/react";
import { Navbar } from "./navbar";

describe("Navbar", () => {
  it("renders navigation links", () => {
    render(<Navbar />);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Home/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /Favourites/i })).toHaveAttribute(
      "href",
      "/favourites"
    );
  });

  it("renders the app logo link", () => {
    render(<Navbar />);

    expect(screen.getByRole("link", { name: /Movie Database/i })).toHaveAttribute("href", "/");
  });
});
