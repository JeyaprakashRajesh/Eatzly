import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  Touchable,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { ArrowDownUp, Info, Search } from "lucide-react-native";

const orders = [
  {
    id: 1,
    name: "Ramesh K",
    amount: 650,
    quantity: 3,
    pending: 5,
    table: "A",
    date: "2025-02-22T10:34:00Z",
  },
  {
    id: 2,
    name: "Ramesh K",
    amount: 650,
    quantity: 3,
    pending: 5,
    table: "B",
    date: "2025-02-22T10:34:00Z",
  },
  {
    id: 3,
    name: "Ramesh K",
    amount: 650,
    quantity: 3,
    pending: 5,
    table: "C",
    date: "2025-02-21T10:34:00Z",
  },
  {
    id: 4,
    name: "Ramesh K",
    amount: 650,
    quantity: 3,
    pending: 5,
    table: "D",
    date: "2025-02-21T10:34:00Z",
  },
];

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
  const filteredOrders = orders.filter((order) => {
    const lowerQuery = searchQuery.toLowerCase();
    const formattedDate = new Date(order.date)
      .toLocaleDateString("en-GB")
      .toLowerCase();
    return (
      order.name.toLowerCase().includes(lowerQuery) ||
      order.table.toLowerCase().includes(lowerQuery) ||
      order.amount.toString().includes(lowerQuery) ||
      formattedDate.includes(lowerQuery)
    );
  });
  const groupedOrders = groupByDate(filteredOrders);
  const dateKeys = Object.keys(groupedOrders);

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <View
        onTouchEnd={() => {
          Keyboard.dismiss();
        }}
        style={styles.header}
      >
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
          keyExtractor={(item) => item}
          renderItem={({ item: date }) => (
            <View style={styles.dateGroupWrapper}>
              <View style={styles.dateHeaderRow}>
                <Text style={styles.dateHeader}>{date}</Text>
                <Text style={styles.dateHeaderCount}>
                  {groupedOrders[date].length} orders
                </Text>
              </View>
              {groupedOrders[date].map((order, index) => (
                <View style={styles.orderRow} key={order.id}>
                  <Text style={styles.orderCell}>{index + 1}.</Text>
                  <Text style={styles.orderCell}>{order.name}</Text>
                  <Text style={styles.orderCell}>{order.table}</Text>
                  <Text style={styles.orderCell}>₹{order.amount}</Text>
                  <Text style={styles.orderCell}>
                    {new Date(order.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                  <TouchableOpacity style={styles.infoIconContainer}>
                    <Info size={hp("2.6%")} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        />
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
});

export default Orders;
