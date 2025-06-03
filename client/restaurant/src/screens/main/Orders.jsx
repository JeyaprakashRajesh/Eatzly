import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  Touchable,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { ArrowDownUp, Info, Search } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import { handleGetAllOrders } from "@/services/restaurantOperations";

const groupByDate = (data) => {
  return data.reduce((acc, order) => {
    const dateKey = new Date(order.date).toLocaleDateString("en-GB");
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(order);
    return acc;
  }, {});
};

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showItems, setShowItems] = useState(false);
  const dispatch = useDispatch();
  const { id, token } = useSelector((state) => state.auth);
  const orders = useSelector((state) => state.restaurant.orders);
  const filteredOrders = orders.filter((order) => {
    const lowerQuery = searchQuery?.toLowerCase();
    const formattedDate = new Date(order.date || "")
      .toLocaleDateString("en-GB")
      .toLowerCase();
    return (
      order.name?.toLowerCase().includes(lowerQuery) ||
      order.table?.toLowerCase().includes(lowerQuery) ||
      order.amount?.toString().includes(lowerQuery) ||
      formattedDate.includes(lowerQuery)
    );
  });
  const groupedOrders = groupByDate(filteredOrders);
  const dateKeys = Object.keys(groupedOrders);

  useEffect(() => {
    const fetchOrders = async () => {
      await handleGetAllOrders(id, token, dispatch);
      setLoading(false);
    };
    fetchOrders();
  }, [id, token, dispatch]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>Orders</Text>
      </View>
      <View style={styles.seperator}></View>
      <View style={styles.content}>
        <View style={styles.topActions}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search orders . . ."
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
            <Search
              style={{
                position: "absolute",
                left: wp("3.5%"),
                top: "27%",
              }}
              size={hp("2.7%")}
              color={"#ccc"}
            />
          </View>
          <View>
            <ArrowDownUp size={hp("3%")} color={"#626262"} />
          </View>
        </View>
        <FlatList
          data={dateKeys}
          keyExtractor={(item, index) => `${item._id}-${index}`}
          renderItem={({ item: date }) => (
            <View style={styles.dateGroupWrapper}>
              <View style={styles.dateHeaderRow}>
                <Text style={styles.dateHeader}>{"19.4.2025"}</Text>
                <Text style={styles.dateHeaderCount}>
                  {groupedOrders[date].length} orders
                </Text>
              </View>
              {groupedOrders[date].map((order, index) => (
                <View style={styles.orderRow} key={order._id}>
                  <Text style={styles.orderCell}>{index + 1}.</Text>
                  <Text style={styles.orderCell}>
                    {order.customerId?.username || "N/A"}
                  </Text>
                  <Text style={styles.orderCell}>₹{order.totalAmount}</Text>
                  <Text style={styles.orderCell}>
                    {new Date(order.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                  <TouchableOpacity
                    style={styles.infoIconContainer}
                    onPress={() => {
                      setSelectedOrder(order);
                      setModalVisible(true);
                    }}
                  >
                    <Info size={hp("2.6%")} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        />
        <Modal visible={modalVisible} transparent>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "90%",
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 10,
              }}
            >
              <Text style={styles.logoText}>Order Details</Text>
              <ScrollView style={{ marginTop: 10 }}>
                <Text style={styles.orderCell}>
                  Customer: {selectedOrder?.customerId?.username}
                </Text>
                <Text style={styles.orderCell}>
                  Table: {selectedOrder?.tableId?.tableName}
                </Text>
                <Text style={styles.orderCell}>
                  Total: ₹{selectedOrder?.totalAmount}
                </Text>
                <Text style={styles.orderCell}>
                  Status: {selectedOrder?.status}
                </Text>
                <Text style={styles.orderCell}>
                  Date:{" "}
                  {new Date(selectedOrder?.startTime).toLocaleDateString([], {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </Text>
                <Text style={styles.orderCell}>
                  Items: {selectedOrder?.items?.length}
                </Text>
              </ScrollView>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowItems(!showItems)}
              >
                <Text
                  style={{
                    color: "#fff",
                    textAlign: "center",
                    fontFamily: "Montserrat-SemiBold",
                  }}
                >
                  {showItems ? "Hide Items" : "View Items"}
                </Text>
              </TouchableOpacity>
              {showItems && (
                <ScrollView style={{ marginTop: 10 }}>
                  {selectedOrder?.items?.map((item, index) => (
                    <View
                      key={`${item._id}-${index}`}
                      style={{
                        marginBottom: hp("1%"),
                        borderColor: "#ccc",
                        borderBottomWidth: 1,
                        paddingBottom: hp("0.7%"),
                      }}
                    >
                      <Text style={styles.orderCell}>
                        {index + 1}. {item.name}
                      </Text>
                      <Text style={styles.orderCell}>Price: ₹{item.price}</Text>
                      <Text style={styles.orderCell}>
                        Quantity: {item.quantity}
                      </Text>
                      <Text style={styles.orderCell}>Total: ₹{item.total}</Text>
                    </View>
                  ))}
                </ScrollView>
              )}
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text
                  style={{
                    color: "#fff",
                    textAlign: "center",
                    fontFamily: "Montserrat-SemiBold",
                  }}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: wp("3.5%"),
  },
  logoText: {
    fontFamily: "BalooBhaijaan2-Bold",
    fontSize: hp("3.7%"),
    color: colors.text1,
  },
  seperator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: hp("1%"),
    opacity: 0.3,
  },
  topActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    marginBottom: hp("1%"),
    gap: wp("5%"),
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  searchInput: {
    fontSize: hp("1.9%"),
    fontFamily: "Montserrat-Medium",
    color: "#333",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: hp("1%"),
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("1.8%"),
    flex: 1,
    paddingLeft: wp("12%"),
  },
  content: {
    flex: 1,
    paddingHorizontal: wp("3.5%"),
    paddingVertical: hp("1%"),
  },
  dateHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp("1%"),
    marginTop: hp("1.5%"),
  },
  dateHeader: {
    fontSize: hp("2%"),
    fontFamily: "Montserrat-SemiBold",
    color: colors.text1,
  },
  dateHeaderCount: {
    fontSize: hp("1.8%"),
    fontFamily: "Montserrat-Medium",
    color: "#676767",
  },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: hp("1.5%"),
    alignItems: "center",
  },
  orderCell: {
    fontSize: hp("1.9%"),
    fontFamily: "Montserrat-Medium",
    alignItems: "center",
    justifyContent: "center",
  },
  dateGroupWrapper: {
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(204, 204, 204, 0.3)",
    paddingBottom: hp("1%"),
    marginBottom: hp("1%"),
  },
  modalButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 6,
    marginTop: 15,
    fontFamily: "Montserrat-SemiBold",
    textAlign: "center",
  },
});

export default Orders;
