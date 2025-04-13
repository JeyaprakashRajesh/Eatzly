import { View, Text, StyleSheet, Keyboard } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Bell, Headphones } from "lucide-react-native";

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
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
      <View style={styles.content}></View>
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
});
