import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect } from "react";
import { Modal, Image, ScrollView, TextInput } from "react-native";
import { primary } from "../../../../utils/color";
import axios from "axios";
import { BACKEND_URL } from "../../../../utils/routes";
import AsyncStorage from "@react-native-async-storage/async-storage";
const VegIcon = require("../../../../assets/images/veg.png");
const NonVegIcon = require("../../../../assets/images/non-veg.png");

export default function ViewReservation({ route, data }) {
  const { order, restaurant } = route.params;
  const [menu, setMenu] = React.useState([]);
  const [showMenuModal, setShowMenuModal] = React.useState(false);
  const [quantities, setQuantities] = React.useState({});
  const [orderItems, setOrderItems] = React.useState([]);
  const [orderDetails, setOrderDetails] = React.useState()

  const fetchOrderDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${BACKEND_URL}/api/customer/reservations?customerId=${order?.customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data)
      const currentOrder = response.data.orders?.find(o => o._id === order._id);
      setOrderDetails(currentOrder);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/customer/restaurant-menu/${order.restaurantId}`
        );
        setMenu(response.data.menu);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMenu();
    fetchOrderDetails();
  }, []);

  const submitOrderItems = async () => {
    console.log(orderItems)
    try { 
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        `${BACKEND_URL}/api/customer/add-order-item`,
        {
          orderId: orderDetails._id,
          items: orderItems,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Items added:", response.data);
      fetchOrderDetails()
      setShowMenuModal(false);
    } catch (error) {
      console.error("Error adding items:", error);
    }
  };

  if (!orderDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>No reservation found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Reservation Details</Text>
      <Text style={[styles.value, { textAlign: "center", marginBottom: 20 }]}>
        Track and manage your current reservation
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Order ID:</Text>
        <Text style={styles.value}>{orderDetails._id}</Text>

        <Text style={styles.label}>Status:</Text>
        <Text
          style={[
            styles.value,
            {
              color: orderDetails.status === "pending" ? "#f39c12" : "#2ecc71",
            },
          ]}
        >
          {orderDetails.status?.toUpperCase()}
        </Text>

        <Text style={styles.label}>Table ID:</Text>
        <Text style={styles.value}>{orderDetails.tableId}</Text>

        <Text style={styles.label}>Total Amount:</Text>
        <Text style={styles.value}>₹{orderDetails.totalAmount}</Text>

        <Text style={styles.label}>Start Time:</Text>
        <Text style={styles.value}>
          {new Date(orderDetails.startTime).toLocaleString()}
        </Text>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowMenuModal(true)}
        >
          <Text style={styles.buttonText}>View Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Close Order</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.heading, { fontSize: 20, marginTop: 20 }]}>Ordered Items</Text>
      {orderDetails.items.length === 0 ? (
        <Text style={styles.value}>No items added yet.</Text>
      ) : (
        <FlatList
          data={orderDetails.items}
          keyExtractor={(item, index) => item._id + index}
          renderItem={({ item }) => (
            <View style={styles.orderedItemCard}>
              <Text style={styles.label}>{item.name}</Text>
              <Text style={styles.value}>Qty: {item.quantity}</Text>
              <Text style={styles.value}>Price: ₹{item.price}</Text>
              <Text style={styles.value}>Total: ₹{item.total}</Text>
            </View>
          )}
        />
      )}
      
      <Modal visible={showMenuModal} transparent animationType="fade">
        <View style={styles.popupBackground}>
          <View style={styles.popupCard}>
            <Text style={styles.heading}>Menu</Text>
            <ScrollView>
              {menu?.items?.map((item) => (
                <View key={item._id} style={styles.menuItem}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.menuImage}
                  />
                  <View style={{ flex: 1, marginLeft: 15 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.label}>{item.name}</Text>
                        <Text style={styles.value}>₹{item.price}</Text>
                      </View>
                      <View style={styles.iconContainer}>
                        <Image
                          source={item.type === "veg" ? VegIcon : NonVegIcon}
                          style={styles.icon}
                        />
                      </View>
                    </View>
                    <TextInput
                      keyboardType="numeric"
                      placeholder="Qty"
                      style={styles.input}
                      value={quantities[item._id]?.toString() || ""}
                      onChangeText={(text) => {
                        const quantity = parseInt(text) || 0;
                        setQuantities((prev) => ({
                          ...prev,
                          [item._id]: quantity,
                        }));
                        setOrderItems((prevItems) => {
                          const existingItem = prevItems.find((i) => i._id === item._id);
                          if (existingItem) {
                            existingItem.quantity = quantity;
                            return [...prevItems];
                          } else {
                            return [
                              ...prevItems,
                              { name: item.name, _id: item._id, price: item.price, quantity },
                            ];
                          }
                        });
                      }}
                    />
                  </View>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={submitOrderItems}
            >
              <Text style={styles.buttonText}>Add Items to Order</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => setShowMenuModal(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#2c3e50",
    fontFamily: "Montserrat",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#34495e",
    marginTop: 10,
    fontFamily: "Montserrat",
    marginBottom: 5,
  },
  value: {
    fontSize: 15,
    color: "#2c3e50",
    fontFamily: "Montserrat",
    marginBottom: 5,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 30,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    backgroundColor: primary,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 10,
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "Montserrat",
  },
  confirmButton: {
    backgroundColor: primary,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  popupBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  popupCard: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  menuImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 10,
    width: 100,
  },
  iconContainer: {
    marginTop: 5,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  orderedItemCard: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginVertical: 6,
  },
});
