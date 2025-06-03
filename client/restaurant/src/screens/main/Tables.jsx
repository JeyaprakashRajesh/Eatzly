import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  Linking,
  Alert,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";
import TableIcon from "../../../assets/images/table-icon.png";
import { RefreshControl, TextInput } from "react-native-gesture-handler";
import { ArrowDownUp, Info, Link, Plus, Search, X } from "lucide-react-native";
import {
  handleAddTable,
  handleDeleteTable,
  handleEditTable,
  handleGetAllTables,
} from "@/services/restaurantOperations";
import Toast from "react-native-toast-message";
import QRCode from "react-native-qrcode-svg";
import { API_URL } from "@/constants/env";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import ViewShot, { captureRef } from "react-native-view-shot";

export default function Tables() {
  const dispatch = useDispatch();
  const { id, token } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const tables = useSelector((state) => state.restaurant.tables);
  const [filteredTables, setFilteredTables] = useState(tables);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newTable, setNewTable] = useState({ tableName: "", capacity: "" });
  const [selectedTable, setSelectedTable] = useState(null);
  const [isInfoModalVisible, setInfoModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [tableToEdit, setTableToEdit] = useState({
    tableName: "",
    capacity: "",
  });
  const viewShotRef = useRef();
  const QR_IP = "http://172.20.10.2:8000"

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTables(tables);
    } else {
      const filtered = tables.filter((table) =>
        table.tableName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTables(filtered);
    }
  }, [searchQuery, tables]);

  const getAllTables = async () => {
    await handleGetAllTables(id, token, dispatch);
  };

  const addTable = async () => {
    if (newTable.tableName.trim() === "" || newTable.capacity.trim() === "") {
      Toast.show({
        type: "error",
        text1: "Please fill all fields",
      });
      return;
    }
    const nameExists = tables.some(
      (table) =>
        table.tableName?.trim().toLowerCase() ===
        newTable.tableName.trim().toLowerCase()
    );
    if (nameExists) {
      Toast.show({
        type: "error",
        text1: "Table name already exists",
      });
      return;
    }

    const response = await handleAddTable(id, token, newTable, dispatch);
    if (response.success) {
      Toast.show({
        type: "success",
        text1: "Table added successfully",
      });
      setModalVisible(false);
      setNewTable({ tableName: "", capacity: "" });
      getAllTables();
    } else {
      Toast.show({
        type: "error",
        text1: "Something went wrong",
      });
    }
  };
  const shareQRCode = async () => {
    console.log("Requesting media library permissions...");
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Toast.show({ type: "error", text1: "Permission denied" });
      return;
    }

    try {
      const uri = await captureRef(viewShotRef.current, {
        format: "png",
        quality: 1.0,
      });

      await Sharing.shareAsync(uri);
      Toast.show({ type: "success", text1: "QR Code shared!" });
    } catch (error) {
      console.log(error);
      Toast.show({ type: "error", text1: "Failed to share QR code" });
    }
  };

  const editTable = async (selectedTable) => {
    if (
      selectedTable.tableName.trim().toLowerCase() ===
        tableToEdit.tableName.trim().toLowerCase() &&
      selectedTable.capacity === tableToEdit.capacity
    ) {
      Toast.show({
        type: "error",
        text1: "No changes detected",
      });
      return;
    }

    const tableExists = tables.some(
      (table) =>
        table.tableName?.trim().toLowerCase() ===
        tableToEdit.tableName.trim().toLowerCase()
    );
    if (tableExists) {
      Toast.show({
        type: "error",
        text1: "Table name already exists",
      });
      return;
    }

    const response = await handleEditTable(
      id,
      token,
      selectedTable._id,
      tableToEdit,
      dispatch
    );

    if (response.success) {
      Toast.show({
        type: "success",
        text1: "Table edited successfully",
      });
      setEditModalVisible(false);
      setTableToEdit({ tableName: "", capacity: "" });
      getAllTables();
    } else {
      Toast.show({
        type: "error",
        text1: "Something went wrong",
      });
    }
  };

  const deleteTable = async (tableId) => {
    Alert.alert(
      "Delete Table",
      "Are you sure you want to delete this table?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const response = await handleDeleteTable(
              id,
              token,
              tableId,
              dispatch
            );
            if (response.success) {
              Toast.show({
                type: "success",
                text1: "Table deleted successfully",
              });
              setInfoModalVisible(false);
              setSelectedTable(null);
            } else {
              Toast.show({
                type: "error",
                text1: "Something went wrong",
              });
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    getAllTables();
  }, [dispatch]);

  return (
    <SafeAreaView edges={["left", "right", "top"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>Tables</Text>
      </View>
      <View style={styles.seperator}></View>
      <View style={styles.content}>
        <View style={styles.topActions}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search tables . . ."
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
          data={filteredTables}
          numColumns={2}
          keyExtractor={(item) => item._id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => {
                getAllTables();
              }}
            />
          }
          columnWrapperStyle={{ justifyContent: "space-between" }}
          ListEmptyComponent={
            <View style={{ marginTop: hp("25%"), alignSelf: "center" }}>
              <Text
                style={{
                  fontSize: hp("2%"),
                  fontFamily: "Montserrat-MediumItalic",
                  color: "#ccc",
                }}
              >
                No Tables Found
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.tableCard}>
              <TouchableOpacity
                style={styles.infoIconPlaceholder}
                onPress={() => {
                  setSelectedTable(item);
                  setInfoModalVisible(true);
                }}
              >
                <Info size={hp("2.5%")} color={colors.primary} />
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image source={TableIcon} style={styles.tableImage} />
                <Text style={styles.tableName}>
                  {item?.tableName?.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.capacityText}>Capacity: {item.capacity}</Text>
              <View
                style={[
                  styles.statusBadge,
                  item.status === "available"
                    ? styles.available
                    : item.status === "reserved"
                    ? styles.reserved
                    : item.status === "occupied"
                    ? styles.occupied
                    : styles.notAvailable,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    item.status === "occupied"
                      ? styles.occupiedText
                      : item.status === "available"
                      ? { color: "#003f1e" }
                      : item.status === "reserved"
                      ? { color: "#5c4900" }
                      : { color: "#5e0000" },
                  ]}
                >
                  {item.status === "not-available"
                    ? "Not Available"
                    : item.status === "occupied"
                    ? "Occupied"
                    : item.status.charAt(0).toUpperCase() +
                      item.status.slice(1)}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
      <TouchableOpacity
        style={styles.addButtonContainer}
        onPress={() => setModalVisible(true)}
      >
        <Plus size={hp("3.5%")} color={"#fff"} />
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.addTableContainer}>
          <View style={styles.addTableHeader}>
            <Text style={styles.addTableHeaderText}>Add Table</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <X size={hp("2.7%")} color={"#626262"} />
            </TouchableOpacity>
          </View>
          <View style={styles.addTableContent}>
            <View style={styles.addTableInputContainer}>
              <Text style={styles.addTableInputLabel}>Table Name</Text>
              <TextInput
                style={styles.addTableInput}
                value={newTable.tableName}
                maxLength={1}
                placeholder="A"
                onChangeText={(text) =>
                  setNewTable((prev) => ({ ...prev, tableName: text }))
                }
                placeholderTextColor={"#ccc"}
              />
            </View>
            <View style={styles.addTableInputContainer}>
              <Text style={styles.addTableInputLabel}>Capacity</Text>
              <TextInput
                style={styles.addTableInput}
                value={newTable.capacity}
                keyboardType="numeric"
                placeholder="4"
                onChangeText={(text) => {
                  if (/^\d+$/.test(text) || text === "")
                    setNewTable((prev) => ({ ...prev, capacity: text }));
                }}
                placeholderTextColor={"#ccc"}
                returnKeyLabel="Done"
                returnKeyType="done"
              />
            </View>
            <TouchableOpacity
              style={styles.addButtonContainerForm}
              onPress={() => {
                addTable();
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Montserrat-SemiBold",
                  fontSize: hp("1.8%"),
                }}
              >
                Add
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={isInfoModalVisible}
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <View style={styles.tableInfoContainer}>
          <View style={styles.tableInfoHeader}>
            <Text style={styles.tableInfoHeaderText}>Table Info</Text>
            <TouchableOpacity onPress={() => setInfoModalVisible(false)}>
              <X size={hp("2.7%")} color={"#626262"} />
            </TouchableOpacity>
          </View>
          <View style={styles.qrCodeContainer}>
            {selectedTable?._id && (
              <>
                <ViewShot
                  ref={viewShotRef}
                  options={{ format: "png", quality: 1.0 }}
                  style={styles.qrCode}
                >
                  <QRCode
                    value={`${QR_IP}/api/restaurant/table/status/${selectedTable?._id}?token=${token}`}
                    size={hp("23%")}
                  />
                </ViewShot>
                <View style={styles.qrCodeActions}>
                  <TouchableOpacity
                    style={styles.qrCodeButton}
                    onPress={shareQRCode}
                  >
                    <Text style={styles.qrCodeButtonText}>Share QR Code</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#a6a6a6",
                      padding: hp("1%"),
                      borderRadius: hp("1.2%"),
                    }}
                  >
                    <Link
                      onPress={() => {
                        Linking.openURL(
                          `${API_URL}/api/restaurant/table/status/${selectedTable._id}?token=${token}`
                        );
                      }}
                      size={hp("2.7%")}
                      color={"#fff"}
                    />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
          <View style={styles.tableInfoContent}>
            <View style={styles.tableInfoRow}>
              <Text style={styles.tableInfoLabel}>Table Name:</Text>
              <Text style={styles.tableInfoValue}>
                {selectedTable?.tableName}
              </Text>
            </View>
            <View style={styles.tableInfoRow}>
              <Text style={styles.tableInfoLabel}>Capacity:</Text>
              <Text style={styles.tableInfoValue}>
                {selectedTable?.capacity}
              </Text>
            </View>
            <View style={styles.tableInfoRow}>
              <Text style={styles.tableInfoLabel}>Status:</Text>

              <Text style={styles.tableInfoValue}>
                {selectedTable?.status.charAt(0).toUpperCase() +
                  selectedTable?.status.slice(1)}
              </Text>
            </View>
            <View style={styles.tableInfoRow}>
              <Text style={styles.tableInfoLabel}>Created At:</Text>
              <Text style={styles.tableInfoValue}>
                {new Date(selectedTable?.createdAt).toLocaleString()}
              </Text>
            </View>
            <View style={styles.tableActions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  setTableToEdit({
                    tableName: selectedTable.tableName,
                    capacity: selectedTable.capacity,
                  });
                  setInfoModalVisible(false);
                  setEditModalVisible(true);
                }}
              >
                <Text style={styles.tableActionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  deleteTable(selectedTable._id);
                }}
                style={styles.deleteButton}
              >
                <Text style={styles.tableActionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.addTableContainer}>
          <View style={styles.addTableHeader}>
            <Text style={styles.addTableHeaderText}>Edit Table</Text>
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <X size={hp("2.7%")} color={"#626262"} />
            </TouchableOpacity>
          </View>
          <View style={styles.addTableContent}>
            <View style={styles.addTableInputContainer}>
              <Text style={styles.addTableInputLabel}>Table Name</Text>
              <TextInput
                style={styles.addTableInput}
                value={tableToEdit.tableName}
                onChangeText={(text) =>
                  setTableToEdit((prev) => ({ ...prev, tableName: text }))
                }
                placeholder="A"
                placeholderTextColor={"#ccc"}
              />
            </View>
            <View style={styles.addTableInputContainer}>
              <Text style={styles.addTableInputLabel}>Capacity</Text>
              <TextInput
                style={styles.addTableInput}
                value={tableToEdit.capacity.toString()}
                keyboardType="numeric"
                onChangeText={(text) =>
                  setTableToEdit((prev) => ({
                    ...prev,
                    capacity: text,
                  }))
                }
                placeholder="4"
                placeholderTextColor={"#ccc"}
                returnKeyType="done"
                returnKeyLabel="Done"
              />
            </View>
            <TouchableOpacity
              style={styles.addButtonContainerForm}
              onPress={() => {
                editTable(selectedTable);
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Montserrat-SemiBold",
                  fontSize: hp("1.8%"),
                }}
              >
                Save Changes
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
  topActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    marginBottom: hp("2.2%"),
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
    justifyContent: "space-between",
  },
  tableCard: {
    width: wp("45%"),
    backgroundColor: "#f7f7f7",
    borderRadius: wp("2%"),
    padding: wp("3%"),
    marginBottom: hp("2%"),
    alignItems: "center",
    position: "relative",
    borderColor: "#ccc",
    borderWidth: 0.2,
    gap: hp("0.5%"),
  },
  infoIconPlaceholder: {
    position: "absolute",
    top: hp("1%"),
    right: wp("2.5%"),
  },
  tableImage: {
    width: wp("25%"),
    height: hp("25%"),
    aspectRatio: 1,
    resizeMode: "contain",
  },
  tableName: {
    fontSize: hp("3.2%"),
    color: colors.primary,
    position: "absolute",
    fontFamily: "BalooBhaijaan2-Bold",
    top: hp("3.5%"),
  },
  statusBadge: {
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("0.4%"),
    borderRadius: wp("100%"),
  },
  statusText: {
    fontSize: hp("1.5%"),
    fontFamily: "Montserrat-SemiBold",
  },
  available: {
    backgroundColor: "#c8f7dc",
  },
  reserved: {
    backgroundColor: "#fff3b0",
  },
  notAvailable: {
    backgroundColor: "#ffc9c9",
  },
  occupied: {
    backgroundColor: "#89C2FF",
  },
  occupiedText: {
    color: "#0053AC",
  },
  capacityText: {
    fontSize: hp("1.6%"),
    fontFamily: "Montserrat-MediumItalic",
    color: colors.text1,
    marginBottom: hp("1%"),
  },
  addButtonContainer: {
    position: "absolute",
    bottom: hp("2%"),
    right: wp("3.5%"),
    backgroundColor: "#27A8A8",
    width: hp("7%"),
    height: hp("7%"),
    borderRadius: hp("100%"),
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  addTableContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  addTableHeader: {
    backgroundColor: "#fff",
    width: "85%",
    padding: hp("2.5%"),
    borderTopLeftRadius: hp("1.5%"),
    borderTopRightRadius: hp("1.5%"),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addTableHeaderText: {
    fontSize: hp("2.3%"),
    fontFamily: "Montserrat-Bold",
    color: "#333",
  },
  addTableContent: {
    backgroundColor: "#fff",
    width: "85%",
    padding: hp("2.5%"),
    borderBottomLeftRadius: hp("1.5%"),
    borderBottomRightRadius: hp("1.5%"),
  },
  addTableInputContainer: {
    marginBottom: hp("2.5%"),
  },
  addTableInputLabel: {
    fontSize: hp("1.7%"),
    fontFamily: "Montserrat-SemiBold",
    color: "#555",
    marginBottom: hp("1.2%"),
  },
  addTableInput: {
    fontSize: hp("1.9%"),
    fontFamily: "Montserrat-Medium",
    color: "#333",
    backgroundColor: "#f5f5f5",
    borderRadius: hp("1%"),
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("1.8%"),
  },
  addButtonContainerForm: {
    backgroundColor: "#27A8A8",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    paddingVertical: hp("1.5%"),
    borderRadius: wp("2%"),
    marginTop: hp("1%"),
  },
  tableInfoContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  tableInfoHeader: {
    backgroundColor: "#fff",
    width: "85%",
    padding: hp("2.5%"),
    borderTopLeftRadius: hp("1.5%"),
    borderTopRightRadius: hp("1.5%"),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tableInfoHeaderText: {
    fontSize: hp("2.3%"),
    fontFamily: "Montserrat-Bold",
    color: "#333",
  },
  tableInfoContent: {
    backgroundColor: "#fff",
    width: "85%",
    padding: hp("2.5%"),
    borderBottomLeftRadius: hp("1.5%"),
    borderBottomRightRadius: hp("1.5%"),
  },
  tableInfoLabel: {
    fontSize: hp("1.8%"),
    fontFamily: "Montserrat-SemiBold",
    color: "#333",
    marginRight: wp("2%"),
  },
  qrCodeContainer: {
    backgroundColor: "#fff",
    width: "85%",
    alignItems: "center",
    paddingVertical: hp("2%"),
  },
  tableInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("1.2%"),
  },
  tableInfoValue: {
    fontSize: hp("1.8%"),
    fontFamily: "Montserrat-Medium",
    color: "#333",
  },
  qrCodeActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp("3%"),
    marginTop: hp("2%"),
  },
  qrCodeButton: {
    backgroundColor: colors.primary,
    paddingVertical: hp("1.2%"),
    paddingHorizontal: wp("3%"),
    borderRadius: wp("2%"),
    elevation: 3,
  },
  qrCodeButtonText: {
    color: "#fff",
    fontSize: hp("1.8%"),
    fontFamily: "Montserrat-SemiBold",
  },
  qrCode: {
    resizeMode: "contain",
    backgroundColor: "#f7f7f7",
    padding: hp("2.5%"),
    borderRadius: hp("3%"),
    borderColor: colors.primary,
    borderWidth: hp("0.1%"),
  },
  tableActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: hp("2%"),
    marginBottom: hp("1.5%"),
    backgroundColor: "#fff",
    gap: wp("3%"),
  },
  editButton: {
    backgroundColor: "#4caf50",
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("4%"),
    borderRadius: wp("2%"),
    flex: 1,
  },
  deleteButton: {
    backgroundColor: "#f44336",
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("4%"),
    borderRadius: wp("2%"),
    flex: 1,
  },
  tableActionText: {
    color: "#fff",
    fontSize: hp("1.8%"),
    fontFamily: "Montserrat-SemiBold",
    textAlign: "center",
  },
});
