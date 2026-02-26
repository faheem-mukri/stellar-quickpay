"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import { getGroups, Group, calculateBalances } from "@/lib/storage";
import { Header } from "@/components/Header";

export default function GroupsPage() {
  const { publicKey, isConnected, isConnecting, connect, disconnect } = useWallet();
  const [groups, setGroups] = useState<Group[]>([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Step 1: mark as mounted (sessionStorage is now readable)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Step 2: redirect only after mounted
  useEffect(() => {
    if (!mounted) return;
    if (!isConnected && !isConnecting) router.push("/");
  }, [isConnected, isConnecting, mounted]);

  // Step 3: load groups only after mounted
  useEffect(() => {
    if (!mounted) return;
    setGroups(getGroups() ?? []);
  }, [mounted]);

  // Safe filter with null guards
  const myGroups = (groups ?? []).filter((g) =>
    g.members?.some((m) => m.address === publicKey) ?? false
  );

  const S = styles;

  return (
    <div style={S.page}>
      <style>{fonts}</style>
      <Header
        address={publicKey || null}
        isConnecting={isConnecting}
        connect={connect}
        disconnect={disconnect}
      />

      <main style={S.main}>
        {/* Top bar */}
        <div style={S.topBar}>
          <div>
            <h2 style={S.pageTitle}>Your Groups</h2>
            <p style={S.pageSubtitle}>
              {myGroups.length} active group{myGroups.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button onClick={() => router.push("/groups/new")} style={S.newButton}>
            + New Group
          </button>
        </div>

        {/* Empty state */}
        {mounted && myGroups.length === 0 && (
          <div style={S.emptyState}>
            <div style={S.emptyIcon}>🧾</div>
            <p style={S.emptyTitle}>No groups yet</p>
            <p style={S.emptySubtitle}>
              Create your first group to start splitting expenses with friends.
            </p>
            <button onClick={() => router.push("/groups/new")} style={S.newButton}>
              Create a group →
            </button>
          </div>
        )}

        {/* Group cards */}
        <div style={S.grid}>
          {myGroups.map((group) => {
            const balances = calculateBalances(group);
            const myBalance = balances.find((b) => b.address === publicKey);
            const net = myBalance?.net ?? 0;
            const totalExpenses = group.expenses.reduce((s, e) => s + e.amount, 0);

            return (
              <div
                key={group.id}
                onClick={() => router.push(`/groups/${group.id}`)}
                style={S.card}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#2d3748";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#1e2029";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  ...S.accentLine,
                  background: net >= 0
                    ? "linear-gradient(90deg, #00d395, transparent)"
                    : "linear-gradient(90deg, #ef4444, transparent)",
                }} />

                <div style={S.cardHeader}>
                  <div style={S.groupAvatar}>
                    {group.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p style={S.groupName}>{group.name}</p>
                    <p style={S.groupMeta}>
                      {group.members.length} members · {group.expenses.length} expenses
                    </p>
                  </div>
                </div>

                <div style={S.cardStats}>
                  <div>
                    <p style={S.statLabel}>Total Spent</p>
                    <p style={S.statValue}>{totalExpenses.toFixed(2)} XLM</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={S.statLabel}>Your Balance</p>
                    <p style={{
                      ...S.statValue,
                      color: net >= 0 ? "#00d395" : "#ef4444",
                    }}>
                      {net >= 0 ? "+" : ""}{net.toFixed(2)} XLM
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');`;

const styles: Record<string, React.CSSProperties> = {
  page: { background: "#0a0b0f", minHeight: "100vh", fontFamily: "'Syne', sans-serif" },
  main: { maxWidth: 680, margin: "0 auto", padding: "32px 16px 80px" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 },
  pageTitle: { fontSize: 28, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.5px" },
  pageSubtitle: { fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#4b5563", margin: "4px 0 0", letterSpacing: "0.5px" },
  newButton: {
    background: "linear-gradient(135deg, #0052ff, #0066ff)",
    border: "none", borderRadius: 12, padding: "10px 20px",
    color: "#fff", fontSize: 14, fontWeight: 700,
    fontFamily: "'Syne', sans-serif", cursor: "pointer",
  },
  emptyState: {
    textAlign: "center", padding: "80px 24px",
    background: "#0d1117", border: "1px solid #1e2029", borderRadius: 20,
  },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 8px" },
  emptySubtitle: { fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#4b5563", marginBottom: 24 },
  grid: { display: "flex", flexDirection: "column", gap: 12 },
  card: {
    background: "#0d1117", border: "1px solid #1e2029", borderRadius: 20,
    padding: "24px", cursor: "pointer", position: "relative", overflow: "hidden",
    transition: "all 0.2s",
  },
  accentLine: { position: "absolute", top: 0, left: 0, right: 0, height: 2 },
  cardHeader: { display: "flex", alignItems: "center", gap: 14, marginBottom: 20 },
  groupAvatar: {
    width: 44, height: 44, borderRadius: 12,
    background: "linear-gradient(135deg, #0052ff22, #0066ff11)",
    border: "1px solid rgba(0,82,255,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, fontWeight: 800, color: "#0052ff",
    fontFamily: "'Syne', sans-serif", flexShrink: 0,
  },
  groupName: { fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 },
  groupMeta: { fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#4b5563", margin: "3px 0 0" },
  cardStats: { display: "flex", justifyContent: "space-between", alignItems: "flex-end" },
  statLabel: { fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#4b5563", margin: "0 0 4px", letterSpacing: "1px", textTransform: "uppercase" },
  statValue: { fontSize: 18, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.5px" },
};