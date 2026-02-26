"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import {
  getGroup, Group, addExpense, addMember,
  calculateBalances, suggestSettlements,
} from "@/lib/storage";
import { Header } from "@/components/Header";

type Tab = "expenses" | "balances" | "settle";

export default function GroupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { publicKey, isConnecting, connect, disconnect } = useWallet();
  const router = useRouter();

  const [group, setGroup] = useState<Group | null>(null);
  const [tab, setTab] = useState<Tab>("expenses");
  const [focused, setFocused] = useState<string | null>(null);

  // Add expense form
  const [expDesc, setExpDesc] = useState("");
  const [expAmount, setExpAmount] = useState("");
  const [expPaidBy, setExpPaidBy] = useState("");
  const [expSplit, setExpSplit] = useState<string[]>([]);

  // Add member form
  const [memberAddr, setMemberAddr] = useState("");
  const [memberName, setMemberName] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);

  useEffect(() => {
    const g = getGroup(id);
    if (g) {
      setGroup(g);
      setExpPaidBy(publicKey || g.members[0]?.address || "");
      setExpSplit(g.members.map((m) => m.address));
    }
  }, [id, publicKey]);

  const refresh = () => setGroup(getGroup(id));

  const handleAddExpense = () => {
    if (!expDesc || !expAmount || expSplit.length === 0) return;
    addExpense(id, {
      description: expDesc,
      amount: parseFloat(expAmount),
      paidBy: expPaidBy,
      splitAmong: expSplit,
    });
    setExpDesc(""); setExpAmount("");
    refresh();
  };

  const handleAddMember = () => {
    if (!memberAddr.trim() || !memberName.trim()) return;
    addMember(id, { address: memberAddr.trim(), name: memberName.trim() });
    setMemberAddr(""); setMemberName("");
    setShowAddMember(false);
    refresh();
  };

  if (!group) return (
    <div style={{ background: "#0a0b0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#4b5563", fontFamily: "'DM Mono', monospace" }}>Loading...</p>
    </div>
  );

  const balances = calculateBalances(group);
  const suggestions = suggestSettlements(group);
  const totalSpent = group.expenses.reduce((s, e) => s + e.amount, 0);

  const inp = (name: string): React.CSSProperties => ({
    width: "100%", background: "#0a0b0f",
    border: `1px solid ${focused === name ? "#0052ff" : "#1e2029"}`,
    borderRadius: 10, padding: "12px 14px", color: "#fff",
    fontSize: 13, fontFamily: "'DM Mono', monospace",
    outline: "none", transition: "border-color 0.15s", boxSizing: "border-box",
  });

  const lbl: React.CSSProperties = {
    fontFamily: "'DM Mono', monospace", fontSize: 10,
    color: "#4b5563", letterSpacing: "1.5px",
    textTransform: "uppercase", display: "block", marginBottom: 5,
  };

  return (
    <div style={{ background: "#0a0b0f", minHeight: "100vh", fontFamily: "'Syne', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');`}</style>
      <Header address={publicKey || null} isConnecting={isConnecting} connect={connect} disconnect={disconnect} />

      <main style={{ maxWidth: 680, margin: "0 auto", padding: "32px 16px 80px" }}>
        {/* Back */}
        <button onClick={() => router.push("/groups")} style={{
          background: "none", border: "none", color: "#4b5563",
          fontFamily: "'DM Mono', monospace", fontSize: 12,
          cursor: "pointer", marginBottom: 24, padding: 0,
        }}>← Back</button>

        {/* Group header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.5px" }}>
                {group.name}
              </h2>
              {group.description && (
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#4b5563", margin: 0 }}>
                  {group.description}
                </p>
              )}
            </div>
            <button onClick={() => setShowAddMember(!showAddMember)} style={{
              background: "#0d1117", border: "1px solid #1e2029",
              borderRadius: 10, padding: "8px 14px", color: "#9ca3af",
              fontSize: 12, fontFamily: "'DM Mono', monospace", cursor: "pointer",
            }}>
              + Member
            </button>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            {[
              { label: "Total Spent", value: `${totalSpent.toFixed(2)} XLM` },
              { label: "Members", value: group.members.length },
              { label: "Expenses", value: group.expenses.length },
            ].map(({ label, value }) => (
              <div key={label} style={{
                background: "#0d1117", border: "1px solid #1e2029",
                borderRadius: 12, padding: "14px 18px", flex: 1,
              }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#4b5563", margin: "0 0 6px", letterSpacing: "1px", textTransform: "uppercase" }}>{label}</p>
                <p style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.5px" }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Add member form */}
        {showAddMember && (
          <div style={{ background: "#0d1117", border: "1px solid #1e2029", borderRadius: 16, padding: "20px", marginBottom: 20 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: "0 0 16px" }}>Add Member</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={lbl}>Name</label>
                <input placeholder="e.g. Priya" value={memberName} onChange={(e) => setMemberName(e.target.value)}
                  onFocus={() => setFocused("mname")} onBlur={() => setFocused(null)} style={inp("mname")} />
              </div>
              <div style={{ flex: 2, minWidth: 200 }}>
                <label style={lbl}>Stellar Address</label>
                <input placeholder="G..." value={memberAddr} onChange={(e) => setMemberAddr(e.target.value)}
                  onFocus={() => setFocused("maddr")} onBlur={() => setFocused(null)} style={inp("maddr")} />
              </div>
            </div>
            <button onClick={handleAddMember} style={{
              marginTop: 12, background: "linear-gradient(135deg, #0052ff, #0066ff)",
              border: "none", borderRadius: 10, padding: "10px 20px",
              color: "#fff", fontSize: 13, fontWeight: 700,
              fontFamily: "'Syne', sans-serif", cursor: "pointer",
            }}>Add</button>
          </div>
        )}

        {/* Members chips */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          {group.members.map((m) => (
            <div key={m.address} style={{
              background: "#0d1117", border: "1px solid #1e2029",
              borderRadius: 999, padding: "5px 12px",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: m.address === publicKey ? "#0052ff" : "#374151" }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#9ca3af" }}>{m.name}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "#0d1117", border: "1px solid #1e2029", borderRadius: 12, padding: 4 }}>
          {(["expenses", "balances", "settle"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, background: tab === t ? "#1a1d27" : "transparent",
              border: tab === t ? "1px solid #2d3748" : "1px solid transparent",
              borderRadius: 10, padding: "8px", color: tab === t ? "#fff" : "#4b5563",
              fontSize: 13, fontWeight: 600, fontFamily: "'Syne', sans-serif",
              cursor: "pointer", transition: "all 0.15s", textTransform: "capitalize",
            }}>{t}</button>
          ))}
        </div>

        {/* ── EXPENSES TAB ── */}
        {tab === "expenses" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Add expense form */}
            <div style={{ background: "#0d1117", border: "1px solid #1e2029", borderRadius: 16, padding: "20px" }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: "0 0 16px" }}>Add Expense</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ flex: 2 }}>
                    <label style={lbl}>Description</label>
                    <input placeholder="e.g. Dinner" value={expDesc} onChange={(e) => setExpDesc(e.target.value)}
                      onFocus={() => setFocused("edesc")} onBlur={() => setFocused(null)} style={inp("edesc")} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={lbl}>Amount (XLM)</label>
                    <input type="number" placeholder="0.00" value={expAmount} onChange={(e) => setExpAmount(e.target.value)}
                      onFocus={() => setFocused("eamt")} onBlur={() => setFocused(null)} style={inp("eamt")} />
                  </div>
                </div>

                <div>
                  <label style={lbl}>Paid By</label>
                  <select value={expPaidBy} onChange={(e) => setExpPaidBy(e.target.value)}
                    style={{ ...inp("epaid"), appearance: "none" } as React.CSSProperties}>
                    {group.members.map((m) => (
                      <option key={m.address} value={m.address}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={lbl}>Split Among</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {group.members.map((m) => {
                      const checked = expSplit.includes(m.address);
                      return (
                        <button key={m.address} onClick={() => {
                          setExpSplit(checked
                            ? expSplit.filter((a) => a !== m.address)
                            : [...expSplit, m.address]
                          );
                        }} style={{
                          background: checked ? "rgba(0,82,255,0.15)" : "#0a0b0f",
                          border: `1px solid ${checked ? "#0052ff" : "#1e2029"}`,
                          borderRadius: 999, padding: "5px 12px",
                          color: checked ? "#6699ff" : "#4b5563",
                          fontSize: 12, fontFamily: "'DM Mono', monospace",
                          cursor: "pointer", transition: "all 0.15s",
                        }}>{m.name}</button>
                      );
                    })}
                  </div>
                </div>

                <button onClick={handleAddExpense} disabled={!expDesc || !expAmount || expSplit.length === 0}
                  style={{
                    background: !expDesc || !expAmount ? "#1a1d27" : "linear-gradient(135deg, #0052ff, #0066ff)",
                    border: "none", borderRadius: 10, padding: "12px",
                    color: !expDesc || !expAmount ? "#4b5563" : "#fff",
                    fontSize: 14, fontWeight: 700, fontFamily: "'Syne', sans-serif",
                    cursor: !expDesc || !expAmount ? "not-allowed" : "pointer",
                  }}>
                  Add Expense
                </button>
              </div>
            </div>

            {/* Expense list */}
            {group.expenses.length === 0 && (
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#374151", textAlign: "center", padding: "32px 0" }}>
                No expenses yet
              </p>
            )}
            {[...group.expenses].reverse().map((exp) => {
              const paidByMember = group.members.find((m) => m.address === exp.paidBy);
              const share = exp.amount / exp.splitAmong.length;
              return (
                <div key={exp.id} style={{
                  background: "#0d1117", border: "1px solid #1e2029",
                  borderRadius: 14, padding: "16px 20px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: "0 0 4px" }}>{exp.description}</p>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#4b5563", margin: 0 }}>
                      Paid by {paidByMember?.name ?? "Unknown"} · {exp.splitAmong.length} people · {share.toFixed(2)} XLM each
                    </p>
                  </div>
                  <p style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.5px" }}>
                    {exp.amount.toFixed(2)} <span style={{ fontSize: 12, color: "#0052ff" }}>XLM</span>
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* ── BALANCES TAB ── */}
        {tab === "balances" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {balances.map((b) => (
              <div key={b.address} style={{
                background: "#0d1117", border: "1px solid #1e2029",
                borderRadius: 14, padding: "16px 20px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: "linear-gradient(135deg, #0052ff22, #0066ff11)",
                    border: "1px solid rgba(0,82,255,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 800, color: "#0052ff",
                  }}>{b.name.slice(0, 2).toUpperCase()}</div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: "0 0 2px" }}>
                      {b.name} {b.address === publicKey && <span style={{ fontSize: 10, color: "#4b5563" }}>(you)</span>}
                    </p>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#4b5563", margin: 0 }}>
                      Paid {b.paid.toFixed(2)} · Owes {b.owes.toFixed(2)}
                    </p>
                  </div>
                </div>
                <p style={{
                  fontSize: 18, fontWeight: 800, margin: 0, letterSpacing: "-0.5px",
                  color: b.net >= 0 ? "#00d395" : "#ef4444",
                }}>
                  {b.net >= 0 ? "+" : ""}{b.net.toFixed(2)} <span style={{ fontSize: 12 }}>XLM</span>
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── SETTLE TAB ── */}
        {tab === "settle" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {suggestions.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "60px 24px",
                background: "#0d1117", border: "1px solid #1e2029", borderRadius: 16,
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>All settled up!</p>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#4b5563", margin: 0 }}>No outstanding balances in this group.</p>
              </div>
            ) : (
              suggestions.map((s, i) => (
                <div key={i} style={{
                  background: "#0d1117", border: "1px solid #1e2029",
                  borderRadius: 14, padding: "16px 20px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: "0 0 4px" }}>
                      <span style={{ color: "#ef4444" }}>{s.fromName}</span>
                      <span style={{ color: "#4b5563" }}> → </span>
                      <span style={{ color: "#00d395" }}>{s.toName}</span>
                    </p>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#4b5563", margin: 0 }}>
                      {s.from.slice(0, 6)}...{s.from.slice(-4)}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <p style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: 0 }}>
                      {s.amount.toFixed(2)} <span style={{ fontSize: 12, color: "#0052ff" }}>XLM</span>
                    </p>
                    {s.from === publicKey && (
                      <button
                        onClick={() => router.push(`/settle?groupId=${id}&to=${s.to}&toName=${s.toName}&amount=${s.amount}`)}
                        style={{
                          background: "linear-gradient(135deg, #0052ff, #0066ff)",
                          border: "none", borderRadius: 10, padding: "8px 16px",
                          color: "#fff", fontSize: 13, fontWeight: 700,
                          fontFamily: "'Syne', sans-serif", cursor: "pointer",
                        }}
                      >
                        Pay →
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* Settlements history */}
            {group.settlements.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#4b5563", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 12 }}>
                  Settlement History
                </p>
                {group.settlements.map((s) => {
                  const fromMember = group.members.find((m) => m.address === s.from);
                  const toMember = group.members.find((m) => m.address === s.to);
                  return (
                    <div key={s.id} style={{
                      background: "#0d1117", border: "1px solid #1e2029",
                      borderRadius: 12, padding: "12px 16px", marginBottom: 8,
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#6b7280", margin: 0 }}>
                        {fromMember?.name} → {toMember?.name}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: "#00d395", margin: 0 }}>{s.amount.toFixed(2)} XLM</p>
                        {s.txHash && (
                          <a
                            href={`https://stellar.expert/explorer/testnet/tx/${s.txHash}`}
                            target="_blank" rel="noreferrer"
                            style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#0052ff" }}
                          >
                            View ↗
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
