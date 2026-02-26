import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProgressStepper } from "@/components/ProgressStepper";

describe("ProgressStepper", () => {

  // ✅ Test 1: idle state should render nothing
  it("renders nothing when state is idle", () => {
    const { container } = render(<ProgressStepper state="idle" />);
    expect(container).toBeEmptyDOMElement();
  });

  // ✅ Test 2: active step should be visible
  it("shows all steps when state is awaiting_signature", () => {
    render(<ProgressStepper state="awaiting_signature" />);
    expect(screen.getByText("Awaiting Signature")).toBeInTheDocument();
    expect(screen.getByText("Submitting to Horizon")).toBeInTheDocument();
    expect(screen.getByText("Recording in Contract")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  // ✅ Test 3: success state renders all steps
  it("shows all steps when state is success", () => {
    render(<ProgressStepper state="success" />);
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

});