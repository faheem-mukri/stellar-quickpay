"use client";

interface Props {
  total: bigint;
  userTotal: bigint;
}

export default function TotalsCard({ total, userTotal }: Props) {
  return (
    // ✅ className added — becomes 1 column on mobile
    <div className="ss-totals-grid" style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
    }}>
      {[
        { label: "Contract Total", value: total, accent: "#0052ff" },
        { label: "Your Total", value: userTotal, accent: "#00d395" },
      ].map(({ label, value, accent }) => (
        <div key={label} style={{
          background: "#0d1117", border: "1px solid #1e2029",
          borderRadius: 16, padding: "20px 24px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, ${accent}, transparent)`,
          }} />
          <p style={{
            fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 500,
            color: "#4b5563", letterSpacing: "1.5px", textTransform: "uppercase",
            margin: 0, marginBottom: 10,
          }}>
            {label}
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{
              fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800,
              color: "#ffffff", letterSpacing: "-1px",
            }}>
              {value.toString()}
            </span>
            <span style={{
              fontFamily: "'Syne', sans-serif", fontSize: 13,
              fontWeight: 600, color: accent,
            }}>
              XLM
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}