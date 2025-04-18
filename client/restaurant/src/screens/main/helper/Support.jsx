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

export default function Support() {
  return (
    <SafeAreaView edges={["left", "right", "top"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}> Support</Text>
      </View>
      <View style={styles.seperator}></View>
      <View style={styles.content}>
        <Text style={styles.title}>Frequently Asked Questions</Text>
        <Text style={styles.description}>
          Q1: How do I place an order?{"\n"}
          A1: Simply choose your dish from the menu, add it to your cart, and
          proceed to checkout.
        </Text>
        <Text style={styles.description}>
          Q2: How can I track my order?{"\n"}
          A2: After placing your order, you can track its status in real-time
          through the app.
        </Text>

        <Text style={styles.title}>Contact Support</Text>
        <Text style={styles.description}>
          If you need assistance, you can contact us at:{"\n"}
          support@eatzly.com
        </Text>
        <Text style={styles.description}>
          Alternatively, you can reach our customer service team at:{"\n"}
          +1-800-123-4567
        </Text>

        <Text style={styles.title}>About Eatzly Support</Text>
        <Text style={styles.description}>
          At Eatzly, we are committed to providing you with the best customer
          service. Our support team is available 24/7 to assist you with any
          issues you may encounter.
        </Text>
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
    paddingHorizontal: wp("3.5%"),
    paddingVertical: hp("1%"),
  },
  title: {
    fontSize: hp("2.5%"),
    fontWeight: "bold",
    color: colors.text1,
    marginBottom: hp("1%"),
    textTransform: "uppercase",
    fontFamily: "Montserrat-Bold",
  },
  description: {
    fontSize: hp("2%"),
    color: colors.text2,
    lineHeight: hp("2.5%"),
    marginBottom: hp("2%"),
    fontFamily: "Montserrat-Medium",
  },
});
