import { render, screen } from "@testing-library/react";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(<EmptyState title="No results" description="Try a different search term." />);

    expect(screen.getByRole("heading", { name: "No results" })).toBeInTheDocument();
    expect(screen.getByText("Try a different search term.")).toBeInTheDocument();
  });

  it("renders only title when description is not provided", () => {
    render(<EmptyState title="No data" />);

    expect(screen.getByRole("heading", { name: "No data" })).toBeInTheDocument();
  });
});
