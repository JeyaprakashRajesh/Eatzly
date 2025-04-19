import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { primary, lightgray, lightgray2 } from "../../../../utils/color";
import { BACKEND_URL } from "../../../../utils/routes";
const { height, width } = Dimensions.get("screen");

const ReservationScreen = ({ route, navigation }) => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  console.log(route.params.data._id);

  const fetchReservations = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return;
      }
      const response = await axios.get(
        `${BACKEND_URL}/api/customer/reservations?customerId=${route.params.data._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReservations(response.data.orders);
      setIsLoading(false);
      console.log(response.data);
    } catch (err) {
      console.log("Error fetching reservations:", err);
    }
  };

  useEffect(() => { 
    fetchReservations();
  }, []);

  const renderItem = ({ item }) => {
    const formattedDate = new Date(item.startTime).toLocaleString();
    return (
      <TouchableOpacity onPress={()=>{
        navigation.navigate("ViewReservation", {
          order: item,
          restaurant: item.restaurantId,
        })
      }} style={styles.card}>
        <Text style={styles.cardTitle}>Reservation ID: {item._id.slice(-6)}</Text>
        <Text style={styles.cardText}>Date: {formattedDate}</Text>
        <Text style={styles.cardText}>Status: 
          <Text style={{
            color: item.status === "pending" ? "#f39c12" : "#2ecc71",
            fontWeight: "bold"
          }}> {item.status.toUpperCase()}</Text>
        </Text>
        <Text style={styles.cardText}>Table ID: {item.tableId}</Text>
        <Text style={styles.cardText}>Items: {item.items.length}</Text>
        <Text style={styles.cardText}>Total Amount: ₹{item.totalAmount}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.topContainer}
        onPress={() => navigation.navigate("ScanQR")}
      >
        <Image
          source={require("../../../../assets/images/add reservations.png")}
          style={styles.AddImage}
        />
        <Text style={styles.addText}>Click to scan QR and Add Reservation</Text>
      </TouchableOpacity>
      <View style={styles.reservationContainer}>
        <Text style={styles.reservationHeading}>Reservations</Text>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={reservations}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={fetchReservations}
              />
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topContainer: {
    height: 250,
    width: width,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    borderBottomColor: lightgray,
    borderBottomWidth: 1,
  },
  AddImage: {
    height: 100,
    width: 100,
  },
  addText: {
    fontFamily: "montserrat-semibold",
    fontSize: width * 0.04,
  },
  reservationContainer: {
    width: width,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.015,
  },
  reservationHeading: {
    fontFamily: "baloo-bold",
    fontSize: width * 0.06,
  },
  card: {
    backgroundColor: lightgray2,
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    gap: 7,
  },
  cardText: {
    fontFamily: "montserrat-regular",
    fontSize: width * 0.04,
  },
  cardTitle: {
    fontFamily: "montserrat-semibold",
    fontSize: width * 0.045,
    marginBottom: 5,
  },
});

export default ReservationScreen;
