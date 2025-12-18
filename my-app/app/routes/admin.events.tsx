import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

type EventDoc = {
  _id: string;
  name: string;
  type: string;
  date: string;
  price: number;
  totalSeats: number;
  bookedSeats: number;
};

export default function AdminEvents() {
  const [events, setEvents] = useState<EventDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "",
    date: "",
    price: 0,
    totalSeats: 0,
  });
  const navigate = useNavigate();

  const loadEvents = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:3000/admin/events");
    const data = await res.json();
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "totalSeats" ? Number(value) : value,
    }));
  };

  const handleCreate = async () => {
    if (!form.name || !form.type || !form.date) {
      alert("All fields are required");
      return;
    }

    const res = await fetch("http://localhost:3000/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("Failed to create event");
      return;
    }

    setForm({ name: "", type: "", date: "", price: 0, totalSeats: 0 });
    loadEvents();
  };

  const handleUpdate = async (
    id: string,
    price: number,
    totalSeats: number,
    bookedSeats: number
  ) => {
    if (totalSeats < bookedSeats) {
      alert("Total seats cannot be less than booked seats");
      return;
    }

    const res = await fetch(`http://localhost:3000/admin/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price, totalSeats }),
    });

    if (!res.ok) {
      alert("Update failed");
      return;
    }

    loadEvents();
  };

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <h1>Admin – Events</h1>
        <div style={styles.headerButtons}>
          <button
            style={styles.secondaryButton}
            onClick={() => navigate("/")}
          >
            Home
          </button>
          <button
            style={styles.secondaryButton}
            onClick={() => navigate("/events")}
          >
            User view
          </button>
        </div>
      </div>

      {/* CREATE */}
      <section style={styles.card}>
        <h2>Create Event</h2>

        <div style={styles.formGrid}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
          <input name="type" placeholder="Type" value={form.type} onChange={handleChange} />
          <input name="date" type="date" value={form.date} onChange={handleChange} />
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} />
          <input name="totalSeats" type="number" placeholder="Total Seats" value={form.totalSeats} onChange={handleChange} />
        </div>

        <button style={styles.primaryButton} onClick={handleCreate}>
          Create Event
        </button>
      </section>

      {/* LIST */}
      <section>
        <h2>Existing Events</h2>

        {loading && <p>Loading…</p>}
        {!loading && events.length === 0 && <p>No events</p>}

        {events.map((e) => (
          <AdminEventRow key={e._id} event={e} onUpdate={handleUpdate} />
        ))}
      </section>
    </div>
  );
}

function AdminEventRow({
  event,
  onUpdate,
}: {
  event: EventDoc;
  onUpdate: (id: string, price: number, totalSeats: number, bookedSeats: number) => void;
}) {
  const [price, setPrice] = useState(event.price);
  const [totalSeats, setTotalSeats] = useState(event.totalSeats);

  // ✅ sync local state when props change
  useEffect(() => {
    setPrice(event.price);
    setTotalSeats(event.totalSeats);
  }, [event.price, event.totalSeats]);

  const changed =
    price !== event.price || totalSeats !== event.totalSeats;

  return (
    <div style={styles.card}>
      <h3>{event.name}</h3>
      <p>Type: {event.type}</p>
      <p>Date: {event.date}</p>
      <p>
        Booked: {event.bookedSeats} / {event.totalSeats}
      </p>

      <div style={styles.row}>
        <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        <input type="number" value={totalSeats} onChange={(e) => setTotalSeats(Number(e.target.value))} />

        <button
          style={changed ? styles.button : styles.buttonDisabled}
          disabled={!changed}
          onClick={() =>
            onUpdate(event._id, price, totalSeats, event.bookedSeats)
          }
        >
          Save
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: "1.5rem",
    maxWidth: "900px",
    margin: "0 auto",
    fontFamily: "system-ui, sans-serif",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.25rem",
  },
  headerButtons: {
    display: "flex",
    gap: "0.5rem",
  },
  card: {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "1rem",
    marginBottom: "1rem",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "0.6rem",
    marginBottom: "0.75rem",
  },
  row: {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
  },
  button: {
    padding: "0.45rem 0.7rem",
    cursor: "pointer",
  },
  buttonDisabled: {
    padding: "0.45rem 0.7rem",
    background: "#eee",
    color: "#888",
    border: "1px solid #ccc",
  },
  primaryButton: {
    padding: "0.55rem 0.9rem",
    background: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "0.45rem 0.9rem",
    borderRadius: "4px",
    border: "1px solid #d1d5db",
    background: "#f9fafb",
    cursor: "pointer",
  },
};
