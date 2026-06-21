import { render, screen } from "@testing-library/react";
import { Spinner } from "./spinner";

describe("Spinner", () => {
  it("renders a status element", () => {
    render(<Spinner />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("uses the provided label", () => {
    render(<Spinner label="Loading movies" />);

    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Loading movies");
  });
});
