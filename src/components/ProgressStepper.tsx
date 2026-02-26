"use client";

import { TxState } from "@/hooks/usePayment";

const steps = [
  { key: "awaiting_signature", label: "Awaiting Signature", desc: "Sign with your wallet" },
  { key: "submitting", label: "Submitting", desc: "Broadcasting to Horizon" },
  { key: "recording", label: "Recording", desc: "Writing to contract" },
  { key: "success", label: "Confirmed", desc: "Transaction complete" },
];

type Props = { state: TxState };

export function ProgressStepper({ state }: Props) {
  if (state === "idle") return null;

  const currentIndex = steps.findIndex((s) => s.key === state);

  return (
    <div style={{
      background: "#0d1117",
      border: "1px solid #1e2029",
      borderRadius: 20,
      padding: "24px 28px",
      marginTop: 4,
    }}>
      <p style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 10,
        color: "#4b5563",
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        margin: 0,
        marginBottom: 20,
      }}>
        Transaction Progress
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = step.key === state;
          const isPending = index > currentIndex;

          return (
            <div key={step.key} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              {/* Connector line + dot column */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20 }}>
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: isCompleted
                    ? "#00d395"
                    : isActive
                    ? "#0052ff"
                    : "#1e2029",
                  border: isActive ? "2px solid rgba(0,82,255,0.3)" : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: isActive ? "0 0 12px rgba(0,82,255,0.4)" : "none",
                  transition: "all 0.3s",
                }}>
                  {isCompleted && (
                    <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>✓</span>
                  )}
                  {isActive && (
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#fff",
                      animation: "pulse 1.2s infinite",
                    }} />
                  )}
                </div>
                {/* Vertical line between steps */}
                {index < steps.length - 1 && (
                  <div style={{
                    width: 1,
                    height: 28,
                    background: isCompleted ? "#00d395" : "#1e2029",
                    transition: "background 0.3s",
                    marginTop: 2,
                    marginBottom: 2,
                  }} />
                )}
              </div>

              {/* Label */}
              <div style={{ paddingBottom: index < steps.length - 1 ? 24 : 0, paddingTop: 1 }}>
                <p style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 14,
                  fontWeight: isActive ? 700 : 500,
                  color: isCompleted ? "#00d395" : isActive ? "#ffffff" : "#374151",
                  margin: 0,
                  transition: "color 0.3s",
                }}>
                  {step.label}
                </p>
                <p style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: isActive ? "#6b7280" : "#2d3748",
                  margin: 0,
                  marginTop: 1,
                }}>
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }
      `}</style>
    </div>
  );
}
