import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { FilterForm } from "./filter-form";
import { MovieFilters } from "../model/use-movie-filters";

const defaultFilters: MovieFilters = { year: "", genre: "" };

function StatefulFilterForm({
  initialFilters = defaultFilters,
  onSubmit = jest.fn(),
  onReset = jest.fn(),
}: {
  initialFilters?: MovieFilters;
  onSubmit?: () => void;
  onReset?: () => void;
}) {
  const [filters, setFilters] = useState(initialFilters);

  return (
    <FilterForm
      filters={filters}
      onYearChange={(year) => setFilters((prev) => ({ ...prev, year }))}
      onGenreChange={(genre) => setFilters((prev) => ({ ...prev, genre }))}
      onSubmit={onSubmit}
      onReset={() => {
        setFilters(defaultFilters);
        onReset();
      }}
    />
  );
}

describe("FilterForm", () => {
  it("renders year input, genre select and buttons", () => {
    render(
      <FilterForm
        filters={defaultFilters}
        onYearChange={jest.fn()}
        onGenreChange={jest.fn()}
        onSubmit={jest.fn()}
        onReset={jest.fn()}
      />
    );

    expect(screen.getByLabelText("Year")).toBeInTheDocument();
    expect(screen.getByLabelText("Genre")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Apply filters" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  });

  it("calls onYearChange when year input changes", async () => {
    render(<StatefulFilterForm />);

    await userEvent.type(screen.getByLabelText("Year"), "2010");

    expect(screen.getByLabelText("Year")).toHaveValue(2010);
  });

  it("calls onGenreChange when genre select changes", async () => {
    render(<StatefulFilterForm />);

    await userEvent.selectOptions(screen.getByLabelText("Genre"), "Action");

    expect(screen.getByLabelText("Genre")).toHaveValue("Action");
  });

  it("calls onSubmit when apply button is clicked", async () => {
    const handleSubmit = jest.fn();
    render(
      <FilterForm
        filters={defaultFilters}
        onYearChange={jest.fn()}
        onGenreChange={jest.fn()}
        onSubmit={handleSubmit}
        onReset={jest.fn()}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: "Apply filters" }));

    expect(handleSubmit).toHaveBeenCalled();
  });

  it("calls onReset when reset button is clicked", async () => {
    const handleReset = jest.fn();
    render(
      <StatefulFilterForm
        initialFilters={{ year: "2010", genre: "Action" }}
        onReset={handleReset}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: "Reset" }));

    expect(handleReset).toHaveBeenCalled();
    expect(screen.getByLabelText("Year")).toHaveValue(null);
    expect(screen.getByLabelText("Genre")).toHaveValue("");
  });

  it("disables reset button when no filters are active", () => {
    render(
      <FilterForm
        filters={defaultFilters}
        onYearChange={jest.fn()}
        onGenreChange={jest.fn()}
        onSubmit={jest.fn()}
        onReset={jest.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "Reset" })).toBeDisabled();
  });

  it("disables controls when loading", () => {
    render(
      <FilterForm
        filters={{ year: "2010", genre: "Action" }}
        onYearChange={jest.fn()}
        onGenreChange={jest.fn()}
        onSubmit={jest.fn()}
        onReset={jest.fn()}
        isLoading
      />
    );

    expect(screen.getByLabelText("Year")).toBeDisabled();
    expect(screen.getByLabelText("Genre")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Apply filters" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Reset" })).toBeDisabled();
  });
});
