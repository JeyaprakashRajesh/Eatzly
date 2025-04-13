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
import { ArrowLeft, ArrowRight, Headphones } from "lucide-react-native";
import { TextInput } from "react-native-gesture-handler";

export default function Register({ toggle }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isKeyboard, setIsKeyboard] = useState(false);
  const [step, setStep] = useState(1);
  const [restaurantName, setRestaurantName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [gstin, setGstin] = useState("");
  const [fssai, setFssai] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

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
        <View
          onTouchEnd={() => {
            if (isKeyboard) {
              Keyboard.dismiss();
            }
          }}
          style={styles.content}
        >
          <View style={styles.registerForm}>
            {step === 1 ? (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Restaurant Name:</Text>
                  <TextInput
                    value={restaurantName}
                    onChangeText={setRestaurantName}
                    style={styles.inputText}
                    placeholder="Enter restaurant name"
                    placeholderTextColor="#ccc"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Owner's Name:</Text>
                  <TextInput
                    value={ownerName}
                    onChangeText={setOwnerName}
                    style={styles.inputText}
                    placeholder="Enter owner's name"
                    placeholderTextColor="#ccc"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email Address:</Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    style={styles.inputText}
                    placeholder="Enter email address"
                    placeholderTextColor="#ccc"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Phone Number:</Text>
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

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>City:</Text>
                  <TextInput
                    value={city}
                    onChangeText={setCity}
                    style={styles.inputText}
                    placeholder="Enter city"
                    placeholderTextColor="#ccc"
                  />
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => setStep(2)}
                  >
                    <Text style={styles.nextButtonText}>Next</Text>
                    <ArrowRight size={hp("2.5%")} color={"#fff"} />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View
                style={{
                  justifyContent: "space-between",
                  flex: 1,
                }}
              >
                <View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>State:</Text>
                    <TextInput
                      value={state}
                      onChangeText={setState}
                      style={styles.inputText}
                      placeholder="Enter state"
                      placeholderTextColor="#ccc"
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>PIN Code:</Text>
                    <TextInput
                      value={pincode}
                      onChangeText={setPincode}
                      style={styles.inputText}
                      placeholder="Enter PIN code"
                      placeholderTextColor="#ccc"
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>GSTIN:</Text>
                    <TextInput
                      value={gstin}
                      onChangeText={setGstin}
                      style={styles.inputText}
                      placeholder="Enter GSTIN"
                      placeholderTextColor="#ccc"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>FSSAI:</Text>
                    <TextInput
                      value={fssai}
                      onChangeText={setFssai}
                      style={styles.inputText}
                      placeholder="Enter FSSAI license number"
                      placeholderTextColor="#ccc"
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={() => setStep(1)}
                    >
                      <ArrowLeft size={hp("2.5%")} color={"#fff"} />
                      <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View>
                  <View style={styles.termsContainer}>
                    <Text style={styles.termText}>By Login you accept</Text>
                    <Text style={styles.termText2}>Terms & Conditions</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.loginButtonContainer}
                    onPress={() => alert("Registering...")}
                  >
                    <Text style={styles.loginButtonText}>Register</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <Text style={styles.text1}>
              Already have an account?{" "}
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

  logoText: {
    fontFamily: "BalooBhaijaan2-Bold",
    fontSize: hp("3.7%"),
    color: colors.text1,
  },
  content: {
    flex: 1,
    position: "relative",
    backgroundColor: colors.secondary,
    width: wp("100%"),
    padding: wp("3.5%"),
    borderTopLeftRadius: wp("10%"),
    borderTopRightRadius: wp("10%"),
    paddingBottom: hp("5%"),
    marginTop: hp("3%"),
  },
  registerForm: {
    flex: 1,
    marginTop: hp("1%"),
    justifyContent: "space-between",
  },
  inputContainer: {
    marginHorizontal: wp("2%"),
    flexDirection: "column",
    gap: hp("1.3%"),
    marginVertical: hp("2%"),
  },
  inputLabel: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: hp("1.8%"),
    color: "#fff",
  },
  inputText: {
    fontFamily: "Montserrat-Medium",
    fontSize: hp("1.6%"),
    color: "#fff",
    borderColor: "#ccc",
    borderWidth: hp("0.1%"),
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1.8%"),
    borderRadius: wp("2%"),
  },
  loginButtonContainer: {
    backgroundColor: colors.primary,
    padding: wp("3.5%"),
    borderRadius: wp("3%"),
    alignItems: "center",
    paddingHorizontal: wp("10%"),
    marginTop: hp("2%"),
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("1%"),
    marginTop: hp("2%"),
  },
  nextButtonText: {
    fontFamily: "Montserrat-Regular",
    fontSize: hp("2%"),
    color: "#fff",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("1%"),
    marginTop: hp("2%"),
  },
  backButtonText: {
    fontFamily: "Montserrat-Regular",
    fontSize: hp("2%"),
    color: "#fff",
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
