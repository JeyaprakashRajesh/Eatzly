import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import colors from "../../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import TextLogo from "../../../assets/icons/eatzly-restaurant-text-logo.png";
import CookingIllustration from "../../../assets/images/cooking-illustration.png";
import { Headphones } from "lucide-react-native";
import { TextInput } from "react-native-gesture-handler";

export default function Login({ toggle }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isKeyboard, setIsKeyboard] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboard(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboard(false);
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView edges={["left", "right", "top"]} style={styles.container}>
        <View
          onTouchEnd={() => {
            Keyboard.dismiss();
          }}
          style={styles.header}
        >
          {/* <Image source={TextLogo} style={styles.textLogo} /> */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Eatzly Restaurant</Text>
          </View>
          <Headphones
            size={hp("3.2%")}
            color={"#555"}
            style={{
              marginBottom: hp("0.5%"),
            }}
          />
        </View>
        <View style={styles.content}>
          <View style={styles.illustrationContainer}>
            <Image
              source={CookingIllustration}
              style={styles.cookingIllustration}
            />
          </View>
          <View
            onTouchEnd={() => {
              if (isKeyboard) {
                Keyboard.dismiss();
              }
            }}
            style={styles.loginFormContainer}
          >
            <View>
              <Text style={styles.loginFormTitle}>
                Login using phone number
              </Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone Number:</Text>
                <View style={styles.input}>
                  <Text
                    style={[
                      styles.inputText,
                      {
                        marginLeft: wp("1%"),
                      },
                    ]}
                  >
                    +91
                  </Text>
                  <View style={styles.seperator}></View>
                  <TextInput
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    style={styles.inputText}
                    keyboardType="numeric"
                    maxLength={10}
                    placeholder="Enter your phone number"
                    placeholderTextColor={"#ccc"}
                  />
                </View>
              </View>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                }}
                style={styles.loginButtonContainer}
              >
                <Text style={styles.loginButtonText}>Get OTP</Text>
              </TouchableOpacity>
              <Text style={styles.text1}>
                Don't have an account?{" "}
                <Text
                  onPress={() => {
                    toggle();
                  }}
                  style={styles.text2}
                >
                  Click Here
                </Text>
              </Text>
            </View>

            <View style={styles.termsContainer}>
              <Text style={styles.termText}>By Login you accept</Text>
              <Text style={styles.termText2}>Terms & Conditions</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
  logoContainer: {},
  logoText: {
    fontFamily: "BalooBhaijaan2-Bold",
    fontSize: hp("3.7%"),
    color: colors.text1,
  },
  content: {
    flex: 1,
    position: "relative",
    justifyContent: "space-between",
  },
  cookingIllustration: {
    width: wp("100%"),
    height: hp("30%"),
    resizeMode: "contain",
    position: "absolute",
    zIndex: -1,
    marginTop: hp("2%"),
  },
  loginFormContainer: {
    backgroundColor: colors.secondary,
    width: wp("100%"),
    padding: wp("3.5%"),
    height: hp("64%"),
    borderTopLeftRadius: wp("10%"),
    borderTopRightRadius: wp("10%"),
    justifyContent: "space-between",
    paddingBottom: hp("5%"),
  },
  loginFormTitle: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: hp("2.3%"),
    color: "#fff",
    marginTop: hp("4%"),
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: hp("2%"),
    marginHorizontal: wp("2%"),
    flexDirection: "column",
    alignItems: "flex-start",
    gap: hp("1.3%"),
    marginTop: hp("3%"),
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("2%"),
    backgroundColor: "transparent",
    padding: wp("3.5%"),
    borderRadius: wp("2%"),
    borderWidth: wp("0.4%"),
    borderColor: colors.primary,
    width: "100%",
    paddingVertical: hp("1.8%"),
  },
  inputLabel: {
    fontFamily: "Montserrat-Medium",
    fontSize: hp("1.8%"),
    color: "#fff",
  },
  inputText: {
    fontFamily: "Montserrat-Medium",
    fontSize: hp("1.8%"),
    color: "#fff",
  },
  loginButtonContainer: {
    backgroundColor: colors.primary,
    padding: wp("3.5%"),
    borderRadius: wp("3%"),
    alignItems: "center",
    paddingHorizontal: wp("10%"),
    marginTop: hp("2%"),
  },
  loginButtonText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: hp("2%"),
    color: "#fff",
  },
  termsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: hp("2%"),
    gap: wp("1.3%"),
  },
  termText: {
    fontFamily: "Montserrat-Medium",
    fontSize: hp("1.6%"),
    color: "#fff",
  },
  termText2: {
    fontFamily: "Montserrat-Medium",
    fontSize: hp("1.6%"),
    color: colors.primary,
    textDecoration: "underline",
  },
  seperator: {
    width: wp("0.4%"),
    height: hp("2.5%"),
    backgroundColor: colors.primary,
    borderRadius: wp("1%"),
  },
  text1: {
    fontFamily: "Montserrat-Medium",
    fontSize: hp("1.6%"),
    color: "#fff",
    textAlign: "center",
    marginTop: hp("2%"),
  },
  text2: {
    fontFamily: "Montserrat-Medium",
    fontSize: hp("1.8%"),
    color: colors.primary,
    textDecoration: "underline",
  },
});
