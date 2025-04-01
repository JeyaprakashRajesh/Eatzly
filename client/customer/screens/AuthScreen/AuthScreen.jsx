import { createStackNavigator } from "@react-navigation/stack";
import Phone from "./components/phone";
import { useState } from "react";


const Stack = createStackNavigator();

export default function AuthScreen({ setIsAuthenticated }) {
    const [phone, setPhone] = useState('');

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
            <Stack.Screen name="Login">
                {(props) => <Phone {...props} phone={phone} setPhone={setPhone} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
}
