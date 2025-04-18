import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text } from "react-native";
import Home from "@/screens/main/Home";
import Settings from "@/screens/main/Settings";
import Accounts from "@/screens/main/helper/Accounts";
import Reviews from "@/screens/main/helper/Reviews";
import Support from "@/screens/main/helper/Support";

const Stack = createNativeStackNavigator();

export const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName="Home"
  >
    <Stack.Screen name="Home" component={Home} />
  </Stack.Navigator>
);

export const SettingsStack = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName="Settings"
  >
    <Stack.Screen name="Settings" component={Settings} />
    <Stack.Screen name="Accounts" component={Accounts} />
    <Stack.Screen name="Reviews" component={Reviews} />
    <Stack.Screen name="Support" component={Support} />
  </Stack.Navigator>
);
