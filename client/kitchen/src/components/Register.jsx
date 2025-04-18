import React, { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "manager",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registration Data:", formData);
    // You can add API submission logic here
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor:"#E4F6F9"
      }}
    >
      <div
        style={{
          margin: "2rem auto",
          padding: "2rem",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          width: "30%",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            color: "#1976d2",
          }}
        >
          Register
        </h2>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              marginBottom: "1rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
              style={{
                flex: 1,
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "0.25rem",
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
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              style={{
                flex: 1,
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "0.25rem",
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
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              style={{
                flex: 1,
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "0.25rem",
              }}
            />
          </div>
          <div
            style={{
              marginBottom: "1.5rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "0.25rem",
              }}
            >
              <option value="manager">Manager</option>
              <option value="chef">Chef</option>
              <option value="waiter">Waiter</option>
            </select>
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#1976d2",
              color: "white",
              fontWeight: "bold",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </form>
        <p
          style={{
            textAlign: "center",
            marginTop: "1rem",
            fontSize: "0.875rem",
          }}
        >
          Already have an account?{" "}
          <a
            href="/login"
            style={{
              color: "#1976d2",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Click here
          </a>
        </p>
      </div>
    </div>
  );
}
