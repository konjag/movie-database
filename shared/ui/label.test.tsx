import { render, screen } from "@testing-library/react";
import { Label } from "./label";

describe("Label", () => {
  it("renders a label", () => {
    render(<Label htmlFor="name">Name</Label>);

    expect(screen.getByText("Name")).toHaveAttribute("for", "name");
  });
});
