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
import asyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_URL } from "../../../utils/routes";
import axios from "axios";


export default function Otp({ navigation, phone, setPhone, otp, setOtp, setIsAuthenticated }) {

  async function handleOtpSubmit() {
    console.log(phone, otp)
    if (!otp || otp.length !== 6) {
      
      alert("Invalid OTP", "OTP must be 6 digits.");
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/api/customer/otp`, {
        "phone": phone, 
        "otp": otp,
      });

      const { token, message } = response.data;
      await asyncStorage.setItem("token", token);
      setIsAuthenticated(true)

    } catch (error) {
      console.error(error);
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={30}
        style={styles.bottomKeyboardContainer}
      >
        <View style={styles.topContainer}>
          <View style={styles.topHeadingContainer}>
            <TouchableOpacity onPress={() => navigation.pop()}>
              <Image
                source={require("../../../assets/images/back.png")}
                alt="back"
                style={styles.backIcon}
              />
            </TouchableOpacity>
            <Text style={styles.topHeading}>Enter One-Time Password</Text>
          </View>
          <Text style={styles.otpSent}>
            Otp sent to phone number +91{phone}
          </Text>
          <View style={styles.inputContainer}>
            <Text style={styles.subTitle}>OTP</Text>
            <TextInput
              style={styles.input}
              placeholder="on time password"
              placeholderTextColor={"gray"}
              value={otp}
              onChangeText={setOtp}
              keyboardType="phone-pad"
              maxLength={6}
              
              autoFocus={true}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
            />
          </View>
        </View> 
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.button} onPress={() => handleOtpSubmit()}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
  },
  bottomKeyboardContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
  },
  topContainer: {
    flex: 1,
    width: "90%",
  },
  backIcon: {
    width: 35,
    height: 35,
    resizeMode: "contain",
  },
  topHeadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 60,
    width: "100%",
  },
  topHeading: {
    fontFamily: "montserrat-semibold",
    fontSize: width * 0.045,
    marginLeft: 20,
  },
  otpSent: {
    fontFamily: "montserrat-medium",
    fontSize: width * 0.035,
    marginTop: 40,
    marginBottom: 20,
    color: lightblack,
    width: "100%",
    textAlign: "center",
  },
  subTitle: {
    fontFamily: "montserrat-semibold",
    fontSize: width * 0.03,
    color: lightblack,
    width : "87%"
  },
  input: {
    borderRadius: 10,
    width: "90%",
    height: 50,
    borderColor: primary,
    borderWidth: 2,
    paddingHorizontal: 20,
    outline: "none",
    fontFamily: "montserrat-regular",
  },
  inputContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center"
  },
  bottomContainer : {
    width : "100%",
    flexDirection: "column",
    alignItems : "center",
  },
  button: {
    paddingVertical: 10,
    backgroundColor: primary,
    width: "90%",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: "baloo-bold",
    fontSize: 20,
    color: "white",
  },
});
