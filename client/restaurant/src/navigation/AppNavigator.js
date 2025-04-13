import { View, Text } from "react-native";
import React from "react";
import TabNavigator from "./TabNavigator";
import AuthStack from "./stacks/AuthStack";
import useLoadFonts from "@/hooks/useLoadFonts";

export default function AppNavigator() {
  const isAuthenticated = true;
  const isFontsLoaded = useLoadFonts();

  if (!isFontsLoaded) {
    return null;
  }

  return isAuthenticated ? <TabNavigator /> : <AuthStack />;
}
