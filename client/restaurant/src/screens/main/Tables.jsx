import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useDispatch } from "react-redux";
import TableIcon from "../../../assets/images/table-icon.png";
import { TextInput } from "react-native-gesture-handler";
import { ArrowDownUp, Info, Search } from "lucide-react-native";

export default function Tables() {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const tables = [
    { id: 1, name: "A", status: "available", capacity: 4 },
    { id: 2, name: "B", status: "reserved", capacity: 4 },
    { id: 3, name: "C", status: "not-available", capacity: 4 },
    { id: 4, name: "D", status: "available", capacity: 4 },
    { id: 5, name: "E", status: "reserved", capacity: 4 },
    { id: 6, name: "F", status: "not-available", capacity: 4 },
    { id: 7, name: "G", status: "occupied", capacity: 4 }, 
    { id: 8, name: "H", status: "reserved", capacity: 4 },
    { id: 9, name: "I", status: "not-available", capacity: 4 },
    { id: 10, name: "J", status: "available", capacity: 4 },
    { id: 11, name: "K", status: "reserved", capacity: 4 },
    { id: 12, name: "L", status: "not-available", capacity: 4 },
  ];
  const [filteredTables, setFilteredTables] = useState(tables);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTables(tables);
    } else {
      const filtered = tables.filter((table) =>
        table.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTables(filtered);
    }
  }, [searchQuery]);

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
          keyExtractor={(item) => item.id.toString()}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.tableCard}>
              <TouchableOpacity style={styles.infoIconPlaceholder}>
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
                <Text style={styles.tableName}>{item.name}</Text>
              </View>
              <Text style={styles.capacityText} >Capacity: {item.capacity}</Text>
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
  capacityText:{
    fontSize: hp("1.6%"),
    fontFamily: "Montserrat-MediumItalic",
    color: colors.text1,
    marginBottom: hp("1%"),
  }});
