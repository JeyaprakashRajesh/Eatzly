import React from "react";
import { BaseToast, ErrorToast } from "react-native-toast-message";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#4CAF50",
        backgroundColor: "#e6f4ea",
        marginTop: hp("3%"), 
      }}
      contentContainerStyle={{ paddingHorizontal: hp("3.5%") }}
      text1Style={{
        fontSize: hp("1.8%"),
        color: "#2e7d32",
        fontFamily: "Montserrat-Bold",
      }}
      text2Style={{
        fontSize: hp("1.5%"),
        color: "#4caf50",
        fontFamily: "Montserrat-Medium",
        flexWrap: "wrap",
        width: wp("80%"),

      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "#f44336",
        backgroundColor: "#fdecea",
        marginTop: hp("3%"), 
      }}
      contentContainerStyle={{ paddingHorizontal: hp("3.5%") }}
      text1Style={{
        fontSize: hp("1.8%"),
        color: "#b71c1c",
        fontFamily: "Montserrat-SemiBold",
      }}
      text2Style={{
        fontSize: hp("1.5%"),
        color: "#f44336",
        fontFamily: "Montserrat-Medium",
        flexWrap: "wrap",
        width: wp("80%"),
      }}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#2196F3",
        backgroundColor: "#e3f2fd",
        marginTop: hp("3%"), 
      }}
      contentContainerStyle={{ paddingHorizontal: hp("3.5%") }}
      text1Style={{
        fontSize: hp("1.8%"),
        color: "#0d47a1",
        fontFamily: "Montserrat-SemiBold",
      }}
      text2Style={{
        fontSize: hp("1.5%"),
        color: "#2196F3",
        fontFamily: "Montserrat-Medium",
        flexWrap: "wrap",
        width: wp("80%"),
      }}
    />
  ),
};