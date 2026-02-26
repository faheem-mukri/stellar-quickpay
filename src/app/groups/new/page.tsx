"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import { createGroup } from "@/lib/storage";
import { Header } from "@/components/Header";

export default function NewGroupPage() {
  const { publicKey, isConnecting, connect, disconnect } = useWallet();
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [yourName, setYourName] = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  const handleCreate = () => {
    if (!name.trim() || !yourName.trim() || !publicKey) return;
    const group = createGroup(name.trim(), description.trim(), publicKey, yourName.trim());
    router.push(`/groups/${group.id}`);
  };

  const inputStyle = (name: string): React.CSSProperties => ({
    width: "100%",
    background: "#0a0b0f",
    border: `1px solid ${focused === name ? "#0052ff" : "#1e2029"}`,
    borderRadius: 12, padding: "14px 16px",
    color: "#ffffff", fontSize: 14,
    fontFamily: "'DM Mono', monospace",
    outline: "none", transition: "border-color 0.15s",
    boxSizing: "border-box",
  });

  const labelStyle: React.CSSProperties = {
    fontFamily: "'DM Mono', monospace", fontSize: 10,
    color: "#4b5563", letterSpacing: "1.5px",
    textTransform: "uppercase", display: "block", marginBottom: 6,
  };

  return (
    <div style={{ background: "#0a0b0f", minHeight: "100vh", fontFamily: "'Syne', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');`}</style>
      <Header address={publicKey || null} isConnecting={isConnecting} connect={connect} disconnect={disconnect} />

      <main style={{ maxWidth: 520, margin: "0 auto", padding: "40px 16px 80px" }}>
        {/* Back */}
        <button
          onClick={() => router.push("/groups")}
          style={{
            background: "none", border: "none", color: "#4b5563",
            fontFamily: "'DM Mono', monospace", fontSize: 12,
            cursor: "pointer", marginBottom: 32, padding: 0,
            letterSpacing: "0.5px",
          }}
        >
          ← Back to groups
        </button>

        <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.5px" }}>
          New Group
        </h2>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#4b5563", marginBottom: 32 }}>
          Create a group to start splitting expenses
        </p>

        <div style={{ background: "#0d1117", border: "1px solid #1e2029", borderRadius: 20, padding: "28px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            <div>
              <label style={labelStyle}>Your Name</label>
              <input
                type="text" placeholder="e.g. Alex"
                value={yourName} onChange={(e) => setYourName(e.target.value)}
                onFocus={() => setFocused("yourName")} onBlur={() => setFocused(null)}
                style={inputStyle("yourName")}
              />
            </div>

            <div>
              <label style={labelStyle}>Group Name</label>
              <input
                type="text" placeholder="e.g. Goa Trip 2025"
                value={name} onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                style={inputStyle("name")}
              />
            </div>

            <div>
              <label style={labelStyle}>Description (optional)</label>
              <input
                type="text" placeholder="e.g. Weekend trip expenses"
                value={description} onChange={(e) => setDescription(e.target.value)}
                onFocus={() => setFocused("description")} onBlur={() => setFocused(null)}
                style={inputStyle("description")}
              />
            </div>

            <button
              onClick={handleCreate}
              disabled={!name.trim() || !yourName.trim()}
              style={{
                width: "100%",
                background: !name.trim() || !yourName.trim()
                  ? "#1a1d27"
                  : "linear-gradient(135deg, #0052ff, #0066ff)",
                border: "none", borderRadius: 12, padding: "14px",
                color: !name.trim() || !yourName.trim() ? "#4b5563" : "#fff",
                fontSize: 15, fontWeight: 700, fontFamily: "'Syne', sans-serif",
                cursor: !name.trim() || !yourName.trim() ? "not-allowed" : "pointer",
                transition: "all 0.15s", marginTop: 4,
              }}
            >
              Create Group →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
