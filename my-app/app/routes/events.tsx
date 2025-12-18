import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth-context";

type EventItem = {
  id: string;
  name: string;
  type: string;
  date: string;
  price: number;
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
};

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [seats, setSeats] = useState(1);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetch("http://localhost:3000/events")
      .then((r) => r.json())
      .then(setEvents)
      .catch(() => setMessage("Failed to load events"));
  }, []);

  const handleBook = async () => {
    setMessage("");

    if (!user) {
      setMessage("Please login before booking.");
      return;
    }

    const res = await fetch("http://localhost:3000/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: selectedEventId,
        userId: user.id,
        username: user.username,
        seats,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Booking created with id " + data.id);
    } else {
      setMessage(data.message || "Could not create booking");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <h1>Events</h1>
        <div style={styles.headerButtons}>
          <button style={styles.secondaryButton} onClick={() => navigate("/")}>
            Home
          </button>
          <button
            style={styles.secondaryButton}
            onClick={() => navigate("/admin/events")}
          >
            Admin
          </button>
        </div>
      </div>

      <div style={styles.grid}>
        {events.map((e) => (
          <div
            key={e.id}
            style={{
              ...styles.card,
              borderColor: selectedEventId === e.id ? "#0070f3" : "#ddd",
            }}
          >
            <h3>{e.name}</h3>
            <p>Type: {e.type}</p>
            <p>Date: {e.date}</p>
            <p>Price: ₹{e.price}</p>
            <p>
              Seats: {e.availableSeats} / {e.totalSeats}
            </p>

            <button
              style={styles.button}
              onClick={() => setSelectedEventId(e.id)}
            >
              {selectedEventId === e.id ? "Selected" : "Select"}
            </button>
          </div>
        ))}
      </div>

      <div style={styles.booking}>
         <h2>Book Event</h2>
        <p>
          Selected event:{" "}
          <strong>{selectedEventId || "none"}</strong>
        </p>

        <input
          style={styles.input}
          type="number"
          min={1}
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
        />

        <button
          style={styles.primaryButton}
          onClick={handleBook}
           disabled={!selectedEventId}
        >
          Book
        </button>

        {message && <p>{message}</p>}

        <div style={styles.bookingNavRow}>
          <button
            style={styles.secondaryButton}
            onClick={() => navigate("/")}
          >
            Back to home
          </button>
          <button
            style={styles.secondaryButton}
            onClick={() => navigate("/events")}
          >
            View all events
          </button>
        </div>
      </div>
    </div>
  );
}
const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: "2rem 1rem",
    maxWidth: "1100px",
    margin: "0 auto",
    fontFamily: "Inter, system-ui, sans-serif",
    background: "#f7f8fa",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  headerButtons: {
    display: "flex",
    gap: "0.5rem",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.5rem",
  },

  card: {
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "1.25rem",
    background: "#ffffff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
    transition: "all 0.2s ease",
  },

  button: {
    marginTop: "0.8rem",
    padding: "0.5rem",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    background: "#f9fafb",
    cursor: "pointer",
    fontWeight: 500,
  },

  booking: {
    marginTop: "3rem",
    padding: "1.5rem",
    borderRadius: "10px",
    background: "#ffffff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  bookingNavRow: {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.5rem",
  },

  input: {
    padding: "0.6rem",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    width: "120px",
  },

  primaryButton: {
    padding: "0.65rem",
    borderRadius: "6px",
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  secondaryButton: {
    padding: "0.5rem 0.8rem",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    background: "#f9fafb",
    cursor: "pointer",
    fontWeight: 500,
  },
};
