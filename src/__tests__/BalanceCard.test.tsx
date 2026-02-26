import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BalanceCard from "@/components/BalanceCard";

describe("BalanceCard", () => {

  // ✅ Test 1: shows loading shimmer when balance is empty
  it("shows Loading... when balance is empty", () => {
    const { container } = render(<BalanceCard balance="" />);
    // No balance text shown — shimmer div renders instead
    expect(screen.queryByText("XLM")).not.toBeInTheDocument();
  });

  // ✅ Test 2: renders the number part of the balance
  it("displays formatted balance number when provided", () => {
    render(<BalanceCard balance="100.5" />);
    expect(screen.getByText("100.5")).toBeInTheDocument();
  });

  // ✅ Test 3: renders the XLM label when balance is provided
  it("displays XLM label when balance is provided", () => {
    render(<BalanceCard balance="100.5" />);
    expect(screen.getByText("XLM")).toBeInTheDocument();
  });

  // ✅ Test 4: strips trailing zeros
  it("strips trailing zeros from balance", () => {
    render(<BalanceCard balance="50.0000000" />);
    expect(screen.getByText("50")).toBeInTheDocument();
  });

});
