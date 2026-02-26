import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TotalsCard from "@/components/TotalsCard";

describe("TotalsCard", () => {

  // ✅ Test 1: renders contract total correctly
  it("displays contract total", () => {
    render(<TotalsCard total={500n} userTotal={100n} />);
    expect(screen.getByText("500 XLM")).toBeInTheDocument();
  });

  // ✅ Test 2: renders user total correctly
  it("displays user total", () => {
    render(<TotalsCard total={500n} userTotal={100n} />);
    expect(screen.getByText("100 XLM")).toBeInTheDocument();
  });

  // ✅ Test 3: renders zero values without crashing
  it("handles zero values gracefully", () => {
    render(<TotalsCard total={0n} userTotal={0n} />);
    const zeros = screen.getAllByText("0 XLM");
    expect(zeros).toHaveLength(2); // both contract and user total show 0
  });

});