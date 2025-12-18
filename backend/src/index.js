import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { db } from "./connector.js";

const app = express();

app.use(cors());
app.use(express.json());

// Simple MongoDB models using mongoose
const userSchema = new mongoose.Schema({
  username: String,
});

const eventSchema = new mongoose.Schema({
  name: String,
  type: String, // concert, conference, etc.
  date: String, // ISO string or simple date text
  price: Number,
  totalSeats: Number,
  bookedSeats: { type: Number, default: 0 },
});

const bookingSchema = new mongoose.Schema({
  eventId: String,
  userId: String,
  username: String,
  seats: Number,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const Event = mongoose.model("Event", eventSchema);
const Booking = mongoose.model("Booking", bookingSchema);

app.get("/health", (req, res) => {
  res.send("OK");
});

// Public: list events with simple availability info
app.get("/events", async (req, res) => {
  const events = await Event.find({});
  const withAvailability = events.map((e) => ({
    id: e._id,
    name: e.name,
    type: e.type,
    date: e.date,
    price: e.price,
    totalSeats: e.totalSeats,
    bookedSeats: e.bookedSeats,
    availableSeats: e.totalSeats - e.bookedSeats,
  }));
  res.json(withAvailability);
});

// Public: basic booking endpoint, with simple availability check
app.post("/bookings", async (req, res) => {
  const { eventId, userId, username, seats } = req.body || {};

  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const available = event.totalSeats - event.bookedSeats;
  if (seats > available) {
    return res.status(400).json({ message: "Not enough available seats" });
  }

  const booking = await Booking.create({ eventId, userId, username, seats });
  event.bookedSeats += seats;
  await event.save();

  res.json({ id: booking._id });
});

// Simple login: create or find a user by username
app.post("/login", async (req, res) => {
  const { username } = req.body || {};
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  let user = await User.findOne({ username });
  if (!user) {
    user = await User.create({ username });
  }

  res.json({ id: user._id, username: user.username });
});

// Admin: list all events
app.get("/admin/events", async (req, res) => {
  const events = await Event.find({});
  res.json(events);
});

// Admin: create a new event
app.post("/admin/events", async (req, res) => {
  const { name, type, date, price, totalSeats } = req.body || {};
  const event = await Event.create({
    name,
    type,
    date,
    price,
    totalSeats,
    bookedSeats: 0,
  });
  res.json(event);
});

// Admin: update basic fields like availability and pricing
app.put("/admin/events/:id", async (req, res) => {
  const { id } = req.params;
  const { name, type, date, price, totalSeats } = req.body || {};

  const event = await Event.findById(id);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  event.name = name ?? event.name;
  event.type = type ?? event.type;
  event.date = date ?? event.date;
  event.price = price ?? event.price;
  event.totalSeats = totalSeats ?? event.totalSeats;

  await event.save();
  res.json(event);
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});