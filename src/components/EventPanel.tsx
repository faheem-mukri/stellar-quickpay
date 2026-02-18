"use client";

import { useEffect, useState } from "react";
import { fetchContractEvents, getEvents } from "@/lib/events";

export default function EventPanel() {
    const [events, setEvents] = useState<any[]>([]);

    const fetchEvents = async () => {
        const data = await fetchContractEvents();
        setEvents(data || []);
    };

    useEffect(() => {
        fetchEvents();

        const interval = setInterval(() => {
            fetchEvents();
        }, 5000); // Refresh every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
    <div className="bg-gray-50 p-4 rounded-lg mt-6">
      <h3 className="text-sm- font-semibold mb-2 text-blue-400">
        Live Contract Events
      </h3>

      {events.length === 0 && (
        <p className="text-xs text-black">
          No recent events.
        </p>
      )}

      <div className="space-y-2 text-xs">
        {events.map((event, index) => (
          <div
            key={index}
            className="bg-white p-2 rounded border"
          >
            <p className="text-black">Ledger: {event.ledger}</p>
            <p className="text-black">Event Type: {event.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}