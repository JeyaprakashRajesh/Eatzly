import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { BACKEND_URL } from "../../../../utils/routes";
import { primary } from "../../../../utils/color";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("screen");

export default function ConformReservation({ route, navigation }) {
  const { qr, data } = route.params;
  const [tableData, setTableData] = useState({});
  const [restaurant, setRestaurant] = useState({});
  const [loading, setLoading] = useState(true);
  const dummyqr = `http://192.0.0.2:8000/api/restaurant/table/status/6801f754fd37509a2135861a?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZmJjYzNjNDYyMWZkOTE2NTk5NGUxMyIsInJvbGUiOiJyZXN0YXVyYW50IiwiaWF0IjoxNzQ0ODcwMTAwfQ._w3u1PBvxDsOKHiXnSHPEySVJUqJLu8uKkSql7mG1sU`;

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

        setTableData(response.data.table);
        setRestaurant(response.data.restaurant);
      } catch (err) {
        console.log("Error fetching reservation details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReserveDetails();
  }, []);

  const handleConfirmReservation = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return;
      }
      const response = await axios.post(
        `${BACKEND_URL}/api/customer/reserve`,
        {
          tableId: tableData.id,
          restaurantId: restaurant._id,
          customerId: data?._id && "67f466f16adf55c0f991e9bf",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response:", response.data);
      if(response.data.success){
        navigation.navigate("Reservations");
      }
    } catch (err) {
      console.log("Error confirming reservation:", err);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Reservation Details</Text>

      <View style={styles.restaurantCard}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <Text style={styles.restaurantInfo}>
          {restaurant.city}, {restaurant.state}
        </Text>
        <Text style={styles.restaurantInfo}>{restaurant.phone}</Text>
        <Text style={styles.restaurantInfo}>{restaurant.email}</Text>
      </View>

      <View style={styles.tableCard}>
        <Image
          source={require("../../../../assets/images/table-icon.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.tableTitle}>{tableData.tableName}</Text>
        <Text
          style={[
            styles.tableStatus,
            {
              backgroundColor:
                tableData.status === "available" ? "green" : "orange",
            },
          ]}
        >
          {tableData.status === "available" ? "Available" : "Occupied"}
        </Text>
      </View>
      {tableData.status === "available" && (
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleConfirmReservation}
        >
          <Text style={styles.buttonText}>Confirm Reservation</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: height * 0.05,
    alignItems: "center",
  },
  pageTitle: {
    fontFamily: "Montserrat",
    fontSize: width * 0.06,
    fontWeight: "bold",
    marginBottom: height * 0.03,
  },
  restaurantCard: {
    width: width * 0.9,
    padding: width * 0.05,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: height * 0.03,
  },
  restaurantName: {
    fontFamily: "Montserrat",
    fontSize: width * 0.05,
    fontWeight: "bold",
    marginBottom: height * 0.01,
  },
  restaurantInfo: {
    fontFamily: "Montserrat",
    fontSize: width * 0.04,
    color: "#555",
  },
  tableCard: {
    width: width * 0.9,
    padding: width * 0.05,
    borderRadius: 10,
    alignItems: "center",
    position: "relative",
    justifyContent: "center",
  },
  tableTitle: {
    fontFamily: "baloo-bold",
    fontSize: width * 0.15,
    fontWeight: "bold",
    marginBottom: height * 0.01,
    color: primary,
    position: "absolute",
  },
  tableStatus: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: width * 0.035,
    marginTop: height * 0.005,
    backgroundColor: "green",
    color: "white",
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
    borderRadius: 30,
  },
  image: {
    height: height * 0.3,
    width: width * 0.1,
    aspectRatio: 1,
  },
  buttonContainer: {
    width: width * 0.9,
    backgroundColor: primary,
    padding: width * 0.04,
    borderRadius: 10,
    alignItems: "center",
    marginTop: height * 0.03,
  },
  buttonText: {
    fontFamily: "Montserrat",
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    justifyContent: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
