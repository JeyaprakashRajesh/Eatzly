import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ArrowDownUp, LucideLogOut, Plus, Search } from "lucide-react-native";
import { FlatList, TextInput } from "react-native-gesture-handler";
import VegIcon from "../../../assets/icons/veg-icon.png";
import NonVegIcon from "../../../assets/icons/nonveg-icon.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";

export default function Settings() {
  const dispatch = useDispatch();
  return (
    <SafeAreaView edges={["left", "right", "top"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>Settings</Text>
      </View>
      <View style={styles.seperator}></View>
      <View style={styles.content}>
        <View style={styles.top}>
          <Text style={styles.settingItem}>1. Accounts</Text>
          <Text style={styles.settingItem}>3. Preferences</Text>
          <Text style={styles.settingItem}>4. Support</Text>
        </View>
        <View style={styles.bottom}>
        
            <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: wp("2%"),
            }}
              onPress={() => {
                AsyncStorage.removeItem("token");
                dispatch({
                  type: "SET_AUTH",
                  payload: {
                    isAuthenticated: false,
                    token: false,
                    id: false,
                  },
                });

              }}
            >
              <LucideLogOut size={hp("3%")} color={"#626262"} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
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
    justifyContent: "space-between",
  },
  settingItem: {
    fontSize: hp("2.2%"),
    fontFamily: "Montserrat-Medium",
    color: colors.text1,
    marginBottom: hp("2%"),
  },
  top: {
    gap: hp("2%"),
  },
  bottom: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp("1.5%"),
  },
  versionText: {
    fontSize: hp("1.8%"),
    fontFamily: "Montserrat-Medium",
    color: colors.text1,
  },
  logoutText: {
    fontSize: hp("2.1%"),
    fontFamily: "Montserrat-SemiBold",
    color: "#626262",
  },
});
