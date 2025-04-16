import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
} from "react-native";
import { primary, lightblack, lightgray } from "../../../utils/color";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Platform } from "react-native";
const { width, height } = Dimensions.get("window");
import axios from "axios";
import { BACKEND_URL } from "../../../utils/routes";

export default function Phone({ navigation, phone, setPhone}) {

  async function handleGetOtp() {
    if (phone.length !== 10) {
      alert("Invalid Phone Number", "Please enter a valid 10-digit phone number.");
      return;
    }

    try {

      const response = await axios.post(`${BACKEND_URL}/api/customer/phone`, { "phone": phone });

      if (response.status === 200) {
        navigation.navigate("Otp")
      } else {
        alert("Error", "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error.response?.data || error.message);
      alert("Network Error", error?.response?.data?.message || "Could not connect to server. Please check your connection.");
    }
    
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <Image
          source={require("../../../assets/images/loginIllustration.png")}
          style={styles.topImage}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={30}
        style={styles.bottomKeyboardContainer}
      >
        <View style={styles.bottomContainer}>
          <View style={{ width: "90%", alignItems: "center" }}>
            <Text style={styles.title}>Sign in using Mobile number</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.subTitle}>mobile number</Text>
              <TextInput
                style={styles.input}
                placeholder="mobile number"
                placeholderTextColor={"gray"}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
                autoFocus={true}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
              />
            </View>
          </View>

          <View style={styles.buttonContianer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleGetOtp()}
            >
              <Text style={styles.buttonText}>SUBMIT</Text>
            </TouchableOpacity>

            <Text style={styles.TandC}>
              By clicking on submit, you agree
              <Text style={{ color: primary }}> terms and conditions</Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>

      <View style={styles.bottomNavContainer}></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: primary,
    justifyContent: "center",
    alignItems: "center",
  },
  topContainer: {
    height: 200,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bottomContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "10%",
    justifyContent: "space-between",
  },
  topImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  title: {
    fontFamily: "montserrat-bold",
    fontSize: width * 0.045,
    color: lightblack,
    width: "100%",
    textAlign: "center",
  },
  subTitle: {
    fontFamily: "montserrat-semibold",
    fontSize: width * 0.03,
    color: lightblack,
  },
  input: {
    borderRadius: 10,
    width: "100%",
    height: 50,
    borderColor: primary,
    borderWidth: 2,
    paddingHorizontal: 20,
    outline: "none",
    fontFamily: "montserrat-regular",
  },
  inputContainer: {
    width: "90%",
    marginTop: 30,
    flexDirection: "column",
  },
  buttonContianer: {
    flexDirection: "column",
    alignItems: "center",
    width: "90%",
  },
  button: {
    paddingVertical: 10,
    backgroundColor: primary,
    width: "90%",
    alignItems: "center",
    borderRadius: 10,
  },
  bottomNavContainer: {
    height: "60%",
    width: "100%",
    position: "absolute",
    backgroundColor: "white",
    bottom: 0,
    left: 0,
    zIndex: -1,
  },
  bottomKeyboardContainer: {
    flex: 1,
    width: "100%",
    position: "relative",
  },
  buttonText: {
    fontFamily: "baloo-bold",
    fontSize: 20,
    color: "white",
  },
  TandC: {
    fontFamily: "montserrat-semibold",
    fontSize: width * 0.028,
    color: lightblack,
    marginTop: 10,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
