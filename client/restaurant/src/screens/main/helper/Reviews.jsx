import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";
import { getRestaurant } from "@/services/restaurantOperations";

export default function Reviews() {
  const { id, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const restaurant = useSelector((state) => state.restaurant.restaurant);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    getRestaurant(token, dispatch);
    setRefreshing(false);
  };

  const reviews = restaurant?.reviews || [];

  return (
    <SafeAreaView edges={["left", "right", "top"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>Reviews</Text>
      </View>
      <View style={styles.seperator}></View>
      <FlatList
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        data={reviews}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.reviewItem}>
            <Text style={styles.reviewIndex}>{index + 1}.</Text>
            <View style={styles.reviewContent}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.reviewCustomerName}>
                  {item.customer?.username || "Anonymous"}
                </Text>
                <Text style={styles.reviewRating}>
                  {"⭐".repeat(item.rating)}
                </Text>
              </View>
              <View style={styles.reviewRatingContainer}>
                <Text style={styles.reviewText}>{item.review}</Text>
              </View>
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
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
    paddingHorizontal: wp("3.5%"),
    paddingVertical: hp("1%"),
  },
  reviewItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    padding: wp("3%"),
    borderRadius: wp("2%"),
    marginBottom: hp("1.5%"),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  reviewIndex: {
    fontSize: hp("2%"),
    fontWeight: "600",
    marginRight: wp("2%"),
    color: colors.text1,
    fontFamily: "Montserrat-SemiBold",
  },
  reviewContent: {
    flex: 1,
  },
  reviewRating: {
    fontSize: hp("2%"),
    fontWeight: "bold",
    color: "#f1b500",
    marginRight: wp("1%"),
  },
  reviewCustomerName: {
    fontSize: hp("2%"),
    fontWeight: "bold",
    color: colors.text1,
    marginBottom: hp("0.5%"),
    fontFamily: "Montserrat-SemiBold",
  },
  reviewRatingContainer: {
    flexDirection: "column",
    marginBottom: hp("0.5%"),
    marginTop: hp("0.7%"),
  },
  reviewText: {
    fontSize: hp("1.9%"),
    color: colors.text2,
    fontFamily: "Montserrat-Medium",
  },
});
