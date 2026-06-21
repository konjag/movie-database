import { render, screen } from "@testing-library/react";
import { Input } from "./input";

describe("Input", () => {
  it("renders an input", () => {
    render(<Input placeholder="Type here" />);

    expect(screen.getByPlaceholderText("Type here")).toBeInTheDocument();
  });

  it("forwards type attribute", () => {
    render(<Input type="search" />);

    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("can be disabled", () => {
    render(<Input disabled />);

    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});
