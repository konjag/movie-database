import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "./pagination";

describe("Pagination", () => {
  it("does not render when there is only one page", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={jest.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders page information and navigation buttons", () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={jest.fn()} />);

    expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous page" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next page" })).toBeInTheDocument();
  });

  it("disables previous button on the first page", () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={jest.fn()} />);

    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next page" })).not.toBeDisabled();
  });

  it("disables next button on the last page", () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={jest.fn()} />);

    expect(screen.getByRole("button", { name: "Previous page" })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });

  it("calls onPageChange with the next page", async () => {
    const handleChange = jest.fn();
    render(<Pagination currentPage={2} totalPages={5} onPageChange={handleChange} />);

    await userEvent.click(screen.getByRole("button", { name: "Next page" }));

    expect(handleChange).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange with the previous page", async () => {
    const handleChange = jest.fn();
    render(<Pagination currentPage={2} totalPages={5} onPageChange={handleChange} />);

    await userEvent.click(screen.getByRole("button", { name: "Previous page" }));

    expect(handleChange).toHaveBeenCalledWith(1);
  });
});
