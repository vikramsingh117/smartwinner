## Event Booking System (MERN-style)

Very simple event booking system focusing on **calendar-style events, availability, and bookings**:

- Users can browse events and create bookings.
- Admins can create events and adjust pricing/seat availability.
- Bookings are linked to a basic logged-in user (username only).

This repo has:
- `backend/` – Express + Mongoose API (MongoDB)
- `my-app/` – React Router app (frontend)

---

## Prerequisites

- Node.js 18+ and npm
- Docker (for MongoDB container)

---

## 1. Start MongoDB with Docker

From the project root (`smartwinner`), build and run the Mongo container:

```bash
docker build -f mongo.Dockerfile -t smartwinner-mongo .

docker run -d \
  --name smartwinner-mongo \
  -p 27017:27017 \
  smartwinner-mongo
```

The backend is configured to use `mongodb://127.0.0.1:27017/test_db` (see `backend/src/connector.js`), which this container exposes.

To stop/remove later:

```bash
docker stop smartwinner-mongo
docker rm smartwinner-mongo
```

---

## 2. Backend – API server

From the `backend` directory:

```bash
cd backend
npm install
npm run dev
```

This starts the API on `http://localhost:3000` with routes like:

- `GET /events` – list events with availability
- `POST /bookings` – create a booking (requires logged-in user from frontend)
- `POST /login` – simple username-based login
- `GET /admin/events`, `POST /admin/events`, `PUT /admin/events/:id` – admin management

---

## 3. Frontend – React Router app

From the `my-app` directory:

```bash
cd my-app
npm install
npm run dev
```

Open the dev URL printed in the console (typically `http://localhost:5173`).

Main screens:

- `/` – Home (links to user/admin views and shows logged-in user).
- `/login` – Simple username login (persists only in memory on the client).
- `/events` – User view for browsing events and booking.
- `/admin/events` – Admin view to create/update events.

Make sure **Mongo (Docker container)** and the **backend server** are running before using the frontend.


