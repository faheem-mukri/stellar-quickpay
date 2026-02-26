import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TotalsCard from "@/components/TotalsCard";

describe("TotalsCard", () => {

  // ✅ Test 1: renders contract total number
  it("displays contract total value", () => {
    render(<TotalsCard total={500n} userTotal={100n} />);
    expect(screen.getByText("500")).toBeInTheDocument();
  });

  // ✅ Test 2: renders user total number
  it("displays user total value", () => {
    render(<TotalsCard total={500n} userTotal={100n} />);
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  // ✅ Test 3: renders labels correctly
  it("renders Contract Total and Your Total labels", () => {
    render(<TotalsCard total={0n} userTotal={0n} />);
    expect(screen.getByText("Contract Total")).toBeInTheDocument();
    expect(screen.getByText("Your Total")).toBeInTheDocument();
  });

  // ✅ Test 4: renders XLM labels
  it("renders XLM currency labels", () => {
    render(<TotalsCard total={10n} userTotal={5n} />);
    const xlmLabels = screen.getAllByText("XLM");
    expect(xlmLabels.length).toBeGreaterThanOrEqual(2);
  });

});
