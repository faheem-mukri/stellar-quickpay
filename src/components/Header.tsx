"use client";

import { useRouter } from "next/navigation";

type Props = {
  address: string | null;
  isConnecting: boolean;
  connect: () => void;
  disconnect: () => void;
};

export function Header({ address, isConnecting, connect, disconnect }: Props) {
  const router = useRouter();

  const handleDisconnect = () => {
    disconnect();
    router.push("/"); // Redirect to home on disconnect
  };
  
  return (
    <header style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "20px 32px",
      borderBottom: "1px solid #1e2029",
      background: "#0a0b0f",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Logo mark */}
        <div style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #0052ff, #00c2ff)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          fontWeight: 800,
          color: "#fff",
          fontFamily: "'Syne', sans-serif",
        }}>S</div>
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: 17,
          color: "#ffffff",
          letterSpacing: "-0.3px",
        }}>
          Stellar<span style={{ color: "#0052ff" }}>Pay</span>
        </span>
      </div>

      {address ? (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#13141a",
            border: "1px solid #1e2029",
            borderRadius: 999,
            padding: "6px 14px",
          }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#00d395",
              boxShadow: "0 0 6px #00d395",
            }} />
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 13,
              color: "#9ca3af",
              letterSpacing: "0.5px",
            }}>
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          </div>
          <button
            onClick={disconnect}
            style={{
              background: "transparent",
              border: "1px solid #2d2f3a",
              borderRadius: 999,
              padding: "6px 16px",
              color: "#6b7280",
              fontSize: 13,
              fontFamily: "'Syne', sans-serif",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => {
              (e.target as HTMLButtonElement).style.borderColor = "#ef4444";
              (e.target as HTMLButtonElement).style.color = "#ef4444";
            }}
            onMouseLeave={e => {
              (e.target as HTMLButtonElement).style.borderColor = "#2d2f3a";
              (e.target as HTMLButtonElement).style.color = "#6b7280";
            }}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connect}
          disabled={isConnecting}
          style={{
            background: "linear-gradient(135deg, #0052ff, #0066ff)",
            border: "none",
            borderRadius: 999,
            padding: "8px 20px",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "'Syne', sans-serif",
            cursor: isConnecting ? "not-allowed" : "pointer",
            opacity: isConnecting ? 0.7 : 1,
            transition: "all 0.15s",
          }}
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
    </header>
  );
}
