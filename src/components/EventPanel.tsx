"use client";

import { useEffect, useState } from "react";
import { fetchContractEvents } from "@/lib/events";

export default function EventPanel() {
  const [events, setEvents] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchEvents = async () => {
    const data = await fetchContractEvents();
    setEvents(data || []);
    setLastUpdated(new Date());
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: "#0d1117",
      border: "1px solid #1e2029",
      borderRadius: 20,
      padding: "24px 28px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 16,
          fontWeight: 700,
          color: "#ffffff",
          margin: 0,
        }}>
          Live Events
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#00d395",
            boxShadow: "0 0 6px #00d395",
            animation: "livePulse 2s infinite",
          }} />
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            color: "#4b5563",
            letterSpacing: "1px",
          }}>
            LIVE
          </span>
        </div>
      </div>

      {events.length === 0 ? (
        <div style={{
          padding: "20px 0",
          textAlign: "center",
          fontFamily: "'DM Mono', monospace",
          fontSize: 12,
          color: "#374151",
        }}>
          No recent events
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {events.map((event, index) => (
            <div key={index} style={{
              background: "#0a0b0f",
              border: "1px solid #1e2029",
              borderRadius: 12,
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: "rgba(0,82,255,0.1)",
                  border: "1px solid rgba(0,82,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                }}>⚡</div>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 12,
                  color: "#9ca3af",
                }}>
                  {event.type}
                </span>
              </div>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                color: "#374151",
              }}>
                #{event.ledger}
              </span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
