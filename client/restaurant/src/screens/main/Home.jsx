import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
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
import { Bell, InfoIcon, X } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import LinkIcon from "../../../assets/icons/icon-park_share.png";
import TableIcon from "../../../assets/images/table-icon.png";
import {
  handleGetAllOrders,
  handleGetAllTables,
  handleUpdateRestaurantStatus,
} from "@/services/restaurantOperations";

export default function Home() {
  const restaurant = useSelector((state) => state.restaurant.restaurant);
  const dispatch = useDispatch();
  const { id, token } = useSelector((state) => state.auth);
  const orders = useSelector((state) => state.restaurant.orders);
  const ttables = useSelector((state) => state.restaurant.tables);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showItems, setShowItems] = useState(false);
  const [open, setOpen] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const ordersCompleted = 5;
  const todayRevenue = 1000;
  const monthlyRevenue = 10000;
  const [tables, setTables] = useState(ttables.length);
  const totalTables = 100;
  const occupiedTables = ttables.filter(
    (table) => table.status === "occupied"
  ).length;

  console.log(orders);

  useEffect(() => {
    const fetchOrders = async () => {
      await handleGetAllOrders(id, token, dispatch);
      setLoading(false);
    };
    fetchOrders();
  }, [id, token, dispatch]);

  useEffect(() => {
    const fetchTables = async () => {
      await handleGetAllTables(id, token, dispatch);
    };
    fetchTables();
  }, [id, token, dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await handleGetAllOrders(id, token, dispatch);
    setRefreshing(false);
  };

  const liveOrder = orders.filter((order) => order.status === "pending");

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

  const renderItem = ({ item }) => {
    // Count pending items
    const pendingItemsCount = item.items.filter(
      (menuItem) => !menuItem.completed
    ).length;

    return (
      <View style={styles.liveOrderItem}>
        <View style={styles.tableNameContainer}>
          <Image source={TableIcon} style={styles.tableIcon} />
          <Text style={styles.tableName}>{item.tableId.tableName}</Text>
        </View>
        <View style={styles.liveOrderItemDetails}>
          <View style={styles.liveOrderItemRow}>
            <View style={styles.liveOrderItemRowItem}>
              <Text style={styles.liveOrderItemRowItemLabel}>Name:</Text>
              <Text style={styles.liveOrderItemRowItemValue}>
                {item.customerId.username}
              </Text>
            </View>
          </View>
          <View style={styles.liveOrderItemRow}>
            <View style={styles.liveOrderItemRowItem}>
              <Text style={styles.liveOrderItemRowItemLabel}>Amount:</Text>
              <Text style={styles.liveOrderItemRowItemValue}>
                ₹{item.totalAmount}
              </Text>
            </View>
          </View>
          <View style={styles.liveOrderItemRow}>
            <View style={styles.liveOrderItemRowItem}>
              <Text style={styles.liveOrderItemRowItemLabel}>Qty:</Text>
              <Text style={styles.liveOrderItemRowItemValue}>
                {item.items.length}
              </Text>
            </View>
          </View>
          <View style={styles.liveOrderItemRow}>
            <View style={styles.liveOrderItemRowItem}>
              <Text style={styles.liveOrderItemRowItemLabel}>Pending:</Text>
              <Text style={styles.liveOrderItemRowItemValue}>
                {pendingItemsCount}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.infoIconContainer}>
          <TouchableOpacity
            style={styles.infoIcon}
            onPress={() => {
              setSelectedOrder(item);
              setShowItems(false);
              setModalVisible(true);
            }}
          >
            <InfoIcon size={hp("2.6%")} color={"#707070"} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
                <View style={styles.infoCardBodyRowItem}>
                  <Text style={styles.infoCardBodyRowItemValue}>
                    {occupiedTables} / {tables}
                  </Text>
                </View>
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
            keyExtractor={(item) => item._id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ flexGrow: 1 }}
            ItemSeparatorComponent={() => <View style={{ height: hp("1%") }} />}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          />
        </View>
      </View>
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.logoText}>Order Details</Text>
              <X
                onPress={() => {
                  setSelectedOrder(null);
                  setModalVisible(false);
                }}
                color={"#ccc"}
                size={hp("3%")}
              />
            </View>
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
                Time:{" "}
                {new Date(selectedOrder?.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
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
  orderCell: {
    fontFamily: "Montserrat-Medium",
    fontSize: hp("1.8%"),
    marginBottom: hp("0.5%"),
  },
});
