import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchForm } from "./search-form";

describe("SearchForm", () => {
  it("renders search input and submit button", () => {
    render(<SearchForm onSearch={jest.fn()} />);

    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("calls onSearch with trimmed query on submit", async () => {
    const handleSearch = jest.fn();
    render(<SearchForm onSearch={handleSearch} />);

    const input = screen.getByRole("searchbox");
    await userEvent.type(input, "  Inception  ");
    await userEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(handleSearch).toHaveBeenCalledWith("Inception");
  });

  it("does not submit when query is empty", async () => {
    const handleSearch = jest.fn();
    render(<SearchForm onSearch={handleSearch} />);

    await userEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(handleSearch).not.toHaveBeenCalled();
  });

  it("disables input and button when loading", () => {
    render(<SearchForm onSearch={jest.fn()} isLoading />);

    expect(screen.getByRole("searchbox")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Search" })).toBeDisabled();
  });

  it("uses the default query value", () => {
    render(<SearchForm onSearch={jest.fn()} defaultValue="Matrix" />);

    expect(screen.getByRole("searchbox")).toHaveValue("Matrix");
  });
});
