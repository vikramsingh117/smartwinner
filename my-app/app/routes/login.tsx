import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth-context";

export default function Login() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async () => {
    setMessage("");
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    const data = await res.json();
    if (res.ok) {
      setUser({ id: data.id, username: data.username });
      navigate("/");
    } else {
      setMessage(data.message || "Login failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>Login</h1>
        <p style={styles.subtitle}>Use any simple username to sign in.</p>

        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button
          style={styles.primaryButton}
          onClick={handleLogin}
          disabled={!username}
        >
          Continue
        </button>

        {message && <p>{message}</p>}
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
    maxWidth: "400px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  subtitle: {
    marginBottom: "1.5rem",
    color: "#555",
  },
  input: {
    padding: "0.6rem",
    fontSize: "1rem",
    width: "100%",
    marginBottom: "0.75rem",
  },
  primaryButton: {
    padding: "0.6rem",
    width: "100%",
    background: "#0070f3",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};


