import React from "react";
import Register from "../../components/Register";
import Login from "../../components/Login";
import { useLocation } from "react-router-dom";

export default function Auth() {
  const location = useLocation();
  const isRegister = location.pathname.includes("/register");

  return (
    <div className="auth-container">
      {isRegister ? <Register /> : <Login />}
    </div>
  );
}
