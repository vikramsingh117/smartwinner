import { Link } from "react-router";
import type { Route } from "./+types/home";
import { useAuth } from "../auth-context";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Event Booking System" },
    {
      name: "description",
      content: "Simple event listing and booking with admin management.",
    },
  ];
}

export default function Home() {
  const { user, setUser } = useAuth();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>Event Booking System</h1>
        <p style={styles.subtitle}>
          Simple MERN-style demo focused on events, booking and availability.
        </p>

         {user && (
           <p style={styles.userLine}>
             Logged in as <strong>{user.username}</strong>{" "}
             <button
               style={styles.logoutButton}
               onClick={() => setUser(null)}
             >
               Log out
             </button>
           </p>
         )}

         <nav style={styles.nav}>
          <Link to="/events" style={styles.link}>
            Browse & book events
          </Link>

          <Link to="/admin/events" style={styles.linkSecondary}>
            Admin – manage events
          </Link>

           {!user && (
             <Link to="/login" style={styles.linkSecondary}>
               Login
             </Link>
           )}
        </nav>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f5f5",
    fontFamily: "sans-serif",
  },
  card: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  subtitle: {
    marginBottom: "1.5rem",
    color: "#555",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
   userLine: {
     marginBottom: "1rem",
     display: "flex",
     justifyContent: "space-between",
     alignItems: "center",
   },
  link: {
    padding: "0.6rem",
    background: "#0070f3",
    color: "#fff",
    textDecoration: "none",
    textAlign: "center",
    borderRadius: "4px",
  },
  linkSecondary: {
    padding: "0.6rem",
    border: "1px solid #0070f3",
    color: "#0070f3",
    textDecoration: "none",
    textAlign: "center",
    borderRadius: "4px",
  },
   logoutButton: {
     padding: "0.25rem 0.5rem",
     fontSize: "0.8rem",
     cursor: "pointer",
   },
};
