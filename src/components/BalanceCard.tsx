interface Props {
  balance: string;
}

export default function BalanceCard({ balance }: Props) {
  const formatted = balance
    ? `${parseFloat(balance).toFixed(7).replace(/\.?0+$/, "")}`
    : null;

  return (
    <div style={{
      background: "linear-gradient(135deg, #0d1117 0%, #0f1420 100%)",
      border: "1px solid #1e2029",
      borderRadius: 20,
      padding: "32px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Subtle glow background */}
      <div style={{
        position: "absolute",
        top: -60,
        right: -60,
        width: 200,
        height: 200,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,82,255,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <p style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 11,
        fontWeight: 500,
        color: "#4b5563",
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        margin: 0,
        marginBottom: 12,
      }}>
        XLM Balance
      </p>

      {formatted ? (
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 42,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-2px",
            lineHeight: 1,
          }}>
            {formatted}
          </span>
          <span style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 18,
            fontWeight: 600,
            color: "#0052ff",
          }}>
            XLM
          </span>
        </div>
      ) : (
        <div style={{
          height: 42,
          width: 180,
          borderRadius: 8,
          background: "linear-gradient(90deg, #1a1d27 25%, #1e2231 50%, #1a1d27 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }} />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
