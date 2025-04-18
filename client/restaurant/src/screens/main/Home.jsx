import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Bell, InfoIcon } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import LinkIcon from "../../../assets/icons/icon-park_share.png";
import TableIcon from "../../../assets/images/table-icon.png";
import { handleUpdateRestaurantStatus } from "@/services/restaurantOperations";

export default function Home() {
  const restaurant = useSelector((state) => state.restaurant.restaurant);
  const dispatch = useDispatch();
  const id = useSelector((state) => state.auth.id);
  const token = useSelector((state) => state.auth.token);
  const [open, setOpen] = useState(true);
  const ordersCompleted = 5;
  const todayRevenue = 1000;
  const monthlyRevenue = 10000;
  const tables = 10;
  const totalTables = 100;

  const liveOrder = [
    {
      id: 1,
      name: "John Doe",
      amount: 400,
      quantity: 3,
      pending: 5,
      table: "A",
    },
    {
      id: 2,
      name: "Jane Doe",
      amount: 156,
      quantity: 3,
      pending: 1,
      table: "B",
    },
    {
      id: 3,
      name: "John Doe",
      amount: 400,
      quantity: 3,
      pending: 5,
      table: "C",
    },
  ];

  const updateStatus = async () => {
    if (open) {
      Alert.alert("Are you sure you want to close the restaurant?", "", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Close",
          onPress: async () => {
            setOpen(false);
            await handleUpdateRestaurantStatus(id, token, false, dispatch);
          },
        },
      ]);
    } else {
      Alert.alert("Are you sure you want to open the restaurant?", "", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Open",
          onPress: async () => {
            setOpen(true);
            await handleUpdateRestaurantStatus(id, token, true, dispatch);
          },
        },
      ]);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.liveOrderItem}>
      <View style={styles.tableNameContainer}>
        <Image source={TableIcon} style={styles.tableIcon} />
        <Text style={styles.tableName}>{item.table}</Text>
      </View>
      <View style={styles.liveOrderItemDetails}>
        <View style={styles.liveOrderItemRow}>
          <View style={styles.liveOrderItemRowItem}>
            <Text style={styles.liveOrderItemRowItemLabel}>Name:</Text>
            <Text style={styles.liveOrderItemRowItemValue}>{item.name}</Text>
          </View>
        </View>
        <View style={styles.liveOrderItemRow}>
          <View style={styles.liveOrderItemRowItem}>
            <Text style={styles.liveOrderItemRowItemLabel}>Amount:</Text>
            <Text style={styles.liveOrderItemRowItemValue}>₹{item.amount}</Text>
          </View>
        </View>
        <View style={styles.liveOrderItemRow}>
          <View style={styles.liveOrderItemRowItem}>
            <Text style={styles.liveOrderItemRowItemLabel}>Qty:</Text>
            <Text style={styles.liveOrderItemRowItemValue}>
              {item.quantity}
            </Text>
          </View>
        </View>
        <View style={styles.liveOrderItemRow}>
          <View style={styles.liveOrderItemRowItem}>
            <Text style={styles.liveOrderItemRowItemLabel}>Pending:</Text>
            <Text style={styles.liveOrderItemRowItemValue}>{item.pending}</Text>
          </View>
        </View>
      </View>
      <View style={styles.infoIconContainer}>
        <TouchableOpacity style={styles.infoIcon}>
          <InfoIcon size={hp("2.6%")} color={"#707070"} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <View
        onTouchEnd={() => {
          Keyboard.dismiss();
        }}
        style={styles.header}
      >
        <View>
          <Text style={styles.logoText}>Eatzly Restaurant</Text>
        </View>
        <Bell size={hp("3.2%")} color={"#555"} />
      </View>
      <View style={styles.seperator}></View>
      <View style={styles.content}>
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <Text style={styles.infoCardHeaderText}>
              {restaurant.name},{restaurant.city}
            </Text>
            <Image
              source={LinkIcon}
              style={{
                width: wp("6%"),
                height: hp("6%"),
                aspectRatio: 1,
                resizeMode: "contain",
              }}
            />
          </View>
          <View style={styles.infoCardBody}>
            <View style={styles.infoCardBodyRows}>
              <View style={styles.infoCardBodyRowItem}>
                <View style={styles.bulletCircle} />
                <Text style={styles.infoCardBodyRowItemLabel}>
                  Today Revenue:
                </Text>
                <Text style={styles.infoCardBodyRowItemValue}>
                  ₹{todayRevenue}
                </Text>
              </View>

              <View style={styles.infoCardBodyRowItem}>
                <View style={styles.bulletCircle} />
                <Text style={styles.infoCardBodyRowItemLabel}>
                  Monthly Revenue:
                </Text>
                <Text style={styles.infoCardBodyRowItemValue}>
                  ₹{monthlyRevenue}
                </Text>
              </View>

              <View style={styles.infoCardBodyRowItem}>
                <View style={styles.bulletCircle} />
                <Text style={styles.infoCardBodyRowItemLabel}>
                  Completed Orders:
                </Text>
                <Text style={styles.infoCardBodyRowItemValue}>
                  {ordersCompleted}
                </Text>
              </View>

              <View style={styles.infoCardBodyRowItem}>
                <View style={styles.bulletCircle} />
                <Text style={styles.infoCardBodyRowItemLabel}>Tables:</Text>
                <Text style={styles.infoCardBodyRowItemValue}>
                  {tables} / {totalTables}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                updateStatus();
              }}
              style={[
                styles.statusButton,
                {
                  borderColor: open ? "#4EB24E" : "#B24E4E",
                  padding: open ? hp("2.2%") : hp("1%"),
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color: open ? "#4EB24E" : "#B24E4E",
                  },
                ]}
              >
                {open ? "OPEN" : "CLOSED"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.liveOrders}>
          <View style={styles.liveOrdersHeader}>
            <View style={styles.headerTextLine}></View>
            <Text style={styles.liveOrdersHeaderText}>Live Orders</Text>
            <View style={styles.headerTextLine}></View>
          </View>
        </View>
        <View style={styles.liveOrdersBody}>
          <FlatList
            data={liveOrder}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{
              flexGrow: 1,
              height: hp("40%"),
            }}
            ItemSeparatorComponent={() => <View style={{ height: hp("1%") }} />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

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
  content: {
    flex: 1,
    paddingHorizontal: wp("3.5%"),
    paddingVertical: hp("1%"),
  },
  infoCard: {
    backgroundColor: "#333",
    borderRadius: 17,
    padding: hp("2.5%"),
    marginBottom: hp("1%"),
  },
  infoCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: hp("1.3%"),
    borderBottomWidth: 1,
    borderBottomColor: "#555",
  },
  infoCardHeaderText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: hp("2%"),
    color: "#fff",
  },
  infoCardBody: {
    marginTop: hp("1.7%"),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoCardBodyRows: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    gap: hp("2.5%"),
  },
  infoCardBodyRowItem: {
    marginRight: wp("2%"),
    alignItems: "center",
    flexDirection: "row",
  },
  infoCardBodyRowItemLabel: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: hp("1.7%"),
    color: "#fff",
    marginRight: wp("1.5%"),
  },
  infoCardBodyRowItemValue: {
    fontFamily: "Montserrat-Medium",
    fontSize: hp("1.7%"),
    color: "#fff",
  },
  bulletCircle: {
    width: wp("1.5%"),
    height: wp("1.5%"),
    borderRadius: wp("0.75%"),
    backgroundColor: "#fff",
    marginRight: wp("2%"),
  },
  statusButton: {
    backgroundColor: "#F2F2F2",
    borderRadius: 10000,
    marginTop: hp("1.5%"),
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: 1,
    borderColor: "#4EB24E",
    borderWidth: hp("0.6%"),
  },
  statusText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: hp("1.8%"),
    color: "#4EB24E",
  },
  liveOrders: {
    marginTop: hp("1%"),
    flex: 1,
  },
  liveOrdersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp("1%"),
    gap: wp("2%"),
  },
  headerTextLine: {
    height: 1,
    backgroundColor: "#ccc",
    flex: 1,
    marginHorizontal: wp("1%"),
    opacity: 0.5,
  },
  liveOrdersHeaderText: {
    fontFamily: "Montserrat-SemiBoldItalic",
    fontSize: hp("2%"),
    color: colors.text1,
  },
  liveOrderItem: {
    padding: hp("1.5%"),
    paddingHorizontal: wp("7%"),
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "rgba(204, 204, 204, 0.5)",
    borderWidth: 1,
    gap: wp("8%"),
    position: "relative",
  },
  liveOrderItemDetails: {
    flexDirection: "column",
    gap: hp("1%"),
  },
  liveOrderItemRow: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  liveOrderItemRowItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  liveOrderItemRowItemValue: {
    fontFamily: "Montserrat-Medium",
    fontSize: hp("1.7%"),
    color: "#333",
  },
  liveOrderItemRowItemLabel: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: hp("1.7%"),
    color: "#333",
    marginRight: wp("1%"),
  },
  tableNameContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  tableIcon: {
    width: wp("12%"),
    height: hp("12%"),
    aspectRatio: 1,
  },
  tableName: {
    fontFamily: "BalooBhaijaan2-Bold",
    fontSize: hp("3%"),
    color: colors.primary,
    position: "absolute",
    top: hp("4%"),
  },
  infoIconContainer: {
    position: "absolute",
    right: wp("2.6%"),
    top: hp("1.2%"),
  },
});
