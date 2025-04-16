import { View, Text, StyleSheet, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ArrowDownUp, Plus, Search } from "lucide-react-native";
import { FlatList, TextInput } from "react-native-gesture-handler";
import VegIcon from "../../../assets/icons/veg-icon.png";
import NonVegIcon from "../../../assets/icons/nonveg-icon.png";

export default function Menu() {
  const [searchQuery, setSearchQuery] = useState("");
  const menu = [
    {
      image:
        "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=900&auto=format&fit=crop&q=60",
      name: "Chicken Biriyani",
      type: "non-veg",
      price: 210,
    },
    {
      image:
        "https://www.allrecipes.com/thmb/qgfQljqLcHe4Zr_SMWzsB2Gd6E8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/AR-85469-indian-chapati-bread-DDMFS-4x3-d2692c11f56b4546b35dccd42ace1958.jpg",
      name: "Chapathi",
      type: "veg",
      price: 20,
    },
    {
      image:
        "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      name: "Masala Dosa",
      type: "veg",
      price: 60,
    },
    {
      image:
        "https://images.unsplash.com/photo-1701579231378-3726490a407b?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      name: "Paneer Butter Masala",
      type: "veg",
      price: 180,
    },
    {
      image:
        "https://images.unsplash.com/photo-1606843046080-45bf7a23c39f?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      name: "Mutton Curry",
      type: "non-veg",
      price: 240,
    },
    {
      image:
        "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      name: "Idli",
      type: "veg",
      price: 30,
    },
    {
      image:
        "https://images.unsplash.com/photo-1656389863341-1dfd38ee6edc?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      name: "Fish Fry",
      type: "non-veg",
      price: 150,
    },
    {
      image:
        "https://images.moneycontrol.com/static-mcnews/2021/04/paratha_shutterstock_1641709639.jpg?impolicy=website&width=1600&height=900",
      name: "Parotta",
      type: "veg",
      price: 15,
    }
  ];
  return (
    <SafeAreaView edges={["left", "right", "top"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>Menu</Text>
      </View>
      <View style={styles.seperator}></View>
      <View style={styles.content}>
        <View style={styles.topActions}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search menu . . ."
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
          key={`flatlist-${2}`}
          data={menu.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          style={{
            marginTop: hp("1.5%"),
          }}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.menuCard}>
              <Image source={{ uri: item.image }} style={styles.menuImage} />
              <View style={styles.row}>
                <Text style={styles.menuTitle}>{item.name}</Text>
                <Image
                  style={styles.menuTypeIcon}
                  source={item.type === "veg" ? VegIcon : NonVegIcon}
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.price}>₹{item.price}</Text>
                <Text style={styles.edit}>Edit</Text>
              </View>
            </View>
          )}
        />
      </View>
      <View style={styles.addButtonContainer}>
        <Plus size={hp("3.5%")} color={"#fff"} />
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
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: hp("2%"),
    overflow: "hidden",
    marginBottom: hp("2%"),
    width: "48%",
    elevation: 2,
  },
  menuImage: {
    width: "100%",
    height: hp("15%"),
    borderTopLeftRadius: hp("1%"),
    borderTopRightRadius: hp("1%"),
    marginBottom: hp("2%"),
  },
  menuTitle: {
    fontSize: hp("2%"),
    fontFamily: "Montserrat-SemiBold",
    color: "#000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: hp("1%"),
    width: "100%",
  },
  price: {
    fontSize: hp("1.8%"),
    color: "#000",
    fontFamily: "Montserrat-Medium",
  },
  edit: {
    fontSize: hp("1.8%"),
    color: "#27A8A8",
    fontFamily: "Montserrat-SemiBold",
  },
  image: {
    flex: 1,
    borderRadius: hp("1%"),
  },
  menuItem: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: hp("1%"),
    marginBottom: hp("1%"),
    overflow: "hidden",
    elevation: 2,
  },
  menuItemImage: {
    width: wp("25%"),
    height: hp("12%"),
    overflow: "hidden",
  },
  menuItemInfo: {
    flex: 1,
    paddingHorizontal: wp("3%"),
    justifyContent: "center",
  },
  menuItemText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: hp("1.9%"),
    color: "#333",
    marginBottom: hp("0.5%"),
  },
  menuTypeIcon: {
    width: wp("4%"),
    height: hp("4%"),
    aspectRatio: 1,
  },
  addButtonContainer:{
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
  }
});
