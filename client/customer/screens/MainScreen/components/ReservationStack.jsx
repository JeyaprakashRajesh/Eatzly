import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../../utils/routes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text } from "react-native";
import ReservationScreen from "./Reservations/ReservationScreen";
import ConfirmReservation from "./Reservations/ConfirmReservation";
import ScanQR from "./Reservations/ScanQR";
import ViewReservation from "./Reservations/ViewReservation";

const Stack = createNativeStackNavigator();

const ReservationStack = ({ data }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [qr, setQr] = useState(null);

  useEffect(() => {
    setReservations(data.reservations);
    setIsLoading(false);
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="Reservations"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Reservations"
        component={ReservationScreen}
        initialParams={{ data, reservations }}
      />
      <Stack.Screen
        name="ScanQR"
        component={ScanQR}
        initialParams={{ qr, setQr }}
      />
      <Stack.Screen
        name="ConfirmReservation"
        component={ConfirmReservation}
        initialParams={{ qr, data }}
      />
      <Stack.Screen
        name="ViewReservation"
        component={ViewReservation}
        initialParams={{ reservations, data }}
      />
    </Stack.Navigator>
  );
};

export default ReservationStack;
