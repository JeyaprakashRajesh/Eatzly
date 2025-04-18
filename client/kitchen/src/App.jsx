import Home from "./pages/Home/Home";
import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import axios from "axios";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:8000/api/kitchen/verify?token=${token}`)
      .then((response) => {
        if (response.data.success) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Token verification failed:", error);
        setIsAuthenticated(false);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="App">Loading...</div>;
  }

  return ( 
    <div className="App">
      <Router>
        {isAuthenticated ? (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Home />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
            <Route path="*" element={<Auth />} />
          </Routes>
        )}
      </Router>
    </div>
  );
}
