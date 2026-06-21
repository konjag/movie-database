import { render, screen } from "@testing-library/react";
import { ErrorMessage } from "./error-message";

describe("ErrorMessage", () => {
  it("renders title and message", () => {
    render(<ErrorMessage title="Error title" message="Something went wrong" />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Error title")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders a retry button when onRetry is provided", () => {
    const handleRetry = jest.fn();
    render(<ErrorMessage message="Failed" onRetry={handleRetry} />);

    const retryButton = screen.getByRole("button", { name: "Try again" });
    expect(retryButton).toBeInTheDocument();

    retryButton.click();
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});
