import { View, Text } from "react-native";
import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";

export default function Auth() {
  const [isRegistered, setIsRegistered] = useState(false);
  return isRegistered ? (
    <Register
      toggle={() => {
        setIsRegistered(false);
      }}
    />
  ) : (
    <Login
      toggle={() => {
        setIsRegistered(true);
      }}
    />
  );
}
