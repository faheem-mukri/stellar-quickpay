import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProgressStepper } from "@/components/ProgressStepper";

describe("ProgressStepper", () => {

  // ✅ Test 1: idle state renders nothing
  it("renders nothing when state is idle", () => {
    const { container } = render(<ProgressStepper state="idle" />);
    expect(container).toBeEmptyDOMElement();
  });

  // ✅ Test 2: shows all step labels when active
  it("shows all steps when state is awaiting_signature", () => {
    render(<ProgressStepper state="awaiting_signature" />);
    expect(screen.getByText("Awaiting Signature")).toBeInTheDocument();
    expect(screen.getByText("Submitting")).toBeInTheDocument();
    expect(screen.getByText("Recording")).toBeInTheDocument();
    expect(screen.getByText("Confirmed")).toBeInTheDocument();
  });

  // ✅ Test 3: shows progress label
  it("shows Transaction Progress heading", () => {
    render(<ProgressStepper state="submitting" />);
    expect(screen.getByText("Transaction Progress")).toBeInTheDocument();
  });

  // ✅ Test 4: success state still renders all steps
  it("renders all steps on success state", () => {
    render(<ProgressStepper state="success" />);
    expect(screen.getByText("Confirmed")).toBeInTheDocument();
  });

});
