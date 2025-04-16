import { createStackNavigator } from "@react-navigation/stack";
import Phone from "./components/phone";
import Otp from "./components/otp";
import { useState } from "react";


const Stack = createStackNavigator();

export default function AuthScreen({ setIsAuthenticated }) {
    const [phone, setPhone] = useState('');
    const [otpValue, setOtpValue] = useState('');
  
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <Stack.Screen name="Login">
          {(props) => <Phone {...props} phone={phone} setPhone={setPhone} />}
        </Stack.Screen>
        <Stack.Screen name="Otp">
          {(props) => <Otp {...props} phone={phone} setPhone={setPhone} otp={otpValue} setOtp={setOtpValue} setIsAuthenticated={setIsAuthenticated} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }
