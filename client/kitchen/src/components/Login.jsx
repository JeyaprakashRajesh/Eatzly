import React, { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${API_URL}/api/kitchen/login`, {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        alert("Login successful!");
        window.location.href = "/";

      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(to right, #f8f9fa, #e0f7fa)",
        padding: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "0.75rem",
          boxShadow: "0 0.25rem 0.75rem rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "25rem",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            color: "#1976d2",
            fontSize: "1.5rem",
          }}
        >
           Login
        </h2>
        <form onSubmit={handleLogin}>
          <div
            style={{
              marginBottom: "1rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                padding: "0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid #ccc",
                fontSize: "1rem",
                outline: "none",
              }}
            />
          </div>
          <div
            style={{
              marginBottom: "1rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: "0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid #ccc",
                fontSize: "1rem",
                outline: "none",
              }}
            />
          </div>
          {error && (
            <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>
          )}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#1976d2",
              color: "white",
              fontWeight: "bold",
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              cursor: "pointer",
              marginTop:"0.7rem"
            }}
          >
            Login
          </button>
          <p style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.875rem" }}>
            Don't have an account?{" "}
            <a href="/register" style={{ color: "#1976d2", textDecoration: "none", fontWeight: "bold" }}>
              Click here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
