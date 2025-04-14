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
import React, { useEffect, useRef, useState } from "react";
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
import Toast from "react-native-toast-message";
import { login } from "@/services/authOperations";
import { useDispatch } from "react-redux";

export default function Login({ toggle }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isKeyboard, setIsKeyboard] = useState(false);
  const [isOtp, setIsOtp] = useState(false);
  const inputs = useRef([]);

  const dispatch = useDispatch();

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

  const handleChange = (text, index) => {
    if (text.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }

    if (newOtp.every((d) => d !== "")) {
      handleVerifyOtp(newOtp.join(""));
    }
  };

  const handleVerifyOtp = async (otpValue) => {
    if (otpValue.length === 6) {
      const response = await login(phone, otpValue, dispatch);
      if (response?.success) {
        Toast.show({
          type: "success",
          text1: "Login successful",
          text2: "You are now logged in",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Login failed",
          text2: "Please try again",
        });
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Invalid OTP",
        text2: "Please enter a valid OTP",
      });
    }
  };

  const handleLogin = async () => {
    if (phone.length === 10) {
      const response = await login(phone, otp, dispatch);

      if (response?.success) {
        Toast.show({
          type: "success",
          text1: "OTP sent to your phone",
          text2: "Please enter the OTP sent to your phone",
        });
        setIsOtp(true);
      } else {
        Toast.show({
          type: "error",
          text1: "Login failed",
          text2: "Please try again",
        });
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Invalid phone number",
        text2: "Please enter a valid phone number",
      });
    }
  };

  return (
    <SafeAreaView edges={["left", "right", "top"]} style={styles.container}>
      <View style={styles.header}>
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
      {isOtp ? (
        <View style={styles.content}>
          <View style={styles.illustrationContainer}>
            <Image
              source={CookingIllustration}
              style={styles.cookingIllustration}
            />
          </View>
          <View
            style={[
              styles.otpFormContainer,
              {
                paddingBottom: isKeyboard ? hp("2.5%") : hp("5%"),
              },
            ]}
          >
            <Text
              style={{
                fontSize: hp("2%"),
                fontFamily: "Montserrat-SemiBold",
                color: "#fff",
              }}
            >
              Enter the OTP sent to your phone
            </Text>
            <View style={styles.otpInputContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputs.current[index] = ref)}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  autoFocus={index === 0}
                  onKeyPress={({ nativeEvent }) => {
                    if (
                      nativeEvent.key === "Backspace" &&
                      !otp[index] &&
                      index > 0
                    ) {
                      inputs.current[index - 1].focus();
                    }
                  }}
                />
              ))}
            </View>
            <View style={styles.termsContainer}>
              <Text style={styles.termText}>By Login you accept</Text>
              <Text style={styles.termText2}>Terms & Conditions</Text>
            </View>
          </View>
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View style={styles.content}>
            <View style={styles.illustrationContainer}>
              <Image
                source={CookingIllustration}
                style={styles.cookingIllustration}
              />
            </View>
            <View style={styles.loginFormContainer}>
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
                      value={phone}
                      onChangeText={setPhone}
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
                    handleLogin();
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
        </KeyboardAvoidingView>
      )}
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
    zIndex: 1,
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
    zIndex: 2,
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
  otpFormContainer: {
    backgroundColor: colors.secondary,
    width: wp("100%"),
    flex: 1,
    borderTopLeftRadius: wp("10%"),
    borderTopRightRadius: wp("10%"),
    gap: wp("8%"),
    marginTop: hp("23%"),
    paddingTop: hp("5%"),
    alignItems: "center",
    zIndex: 2,
  },
  otpInputContainer: {
    flexDirection: "row",
    marginHorizontal: wp("3%"),
    gap: wp("2%"),
  },
  otpInput: {
    width: "14.5%",
    aspectRatio: 1,
    borderRadius: wp("2%"),
    borderWidth: wp("0.4%"),
    borderColor: colors.primary,
    backgroundColor: colors.secondary,
    color: "#fff",
    fontFamily: "Montserrat-Medium",
    fontSize: hp("2%"),
    textAlign: "center",
    padding: wp("2%"),
  },
});
