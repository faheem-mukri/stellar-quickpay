import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BalanceCard from "@/components/BalanceCard";

// 📦 "describe" groups related tests together under one name
describe("BalanceCard", () => {

  // ✅ Test 1: empty balance should show loading
  it("shows Loading... when balance is empty", () => {
    // 1. RENDER — put the component on a fake screen
    render(<BalanceCard balance="" />);

    // 2. FIND — look for the text "Loading..." on that screen
    const loadingText = screen.getByText("Loading...");

    // 3. ASSERT — confirm it actually exists
    expect(loadingText).toBeInTheDocument();
  });

  // ✅ Test 2: a real balance should display formatted with XLM
  it("displays formatted balance when balance is provided", () => {
    render(<BalanceCard balance="100.5" />);

    // It should show "100.5 XLM" (the component strips trailing zeros)
    const balanceText = screen.getByText(/100\.5 XLM/);
    expect(balanceText).toBeInTheDocument();
  });

  // ✅ Test 3: strips unnecessary trailing zeros
  it("strips trailing zeros from balance", () => {
    render(<BalanceCard balance="50.0000000" />);

    const balanceText = screen.getByText(/50 XLM/);
    expect(balanceText).toBeInTheDocument();
  });

});