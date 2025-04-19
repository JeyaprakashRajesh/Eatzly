import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { primary } from "../../../../utils/color";
import axios from "axios";
import { BACKEND_URL } from "../../../../utils/routes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("screen");

export default function ConformReservation({ route, navigation }) {
  const { qr } = route.params;
  console.log(qr);
  const [tableData, setTableData] = useState({});
  const [restaurant, setRestaurant] = useState({});

  useEffect(() => {
    const fetchReserveDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          return;
        }

        const response = await axios.get(qr, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response:", response.data);
        setTableData(response.data.table);
        setRestaurant(response.data.restaurant);
      } catch (err) {
        console.log("Error fetching reservation details:", err);
      }
    };

    fetchReserveDetails();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.headingText}>Confirm Reservation</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../../../assets/images/plateSpoon.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.imageText}>{tableData.tableName}</Text>
      </View>
      <View style={styles.restaurantContainer}>
        <Text style={styles.restaurantName}>{restaurant.}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height : 50,
    width : 50
  }
});
