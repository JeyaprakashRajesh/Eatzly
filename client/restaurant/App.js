import React from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-gesture-handler";

import colors from "./src/constants/colors";
import AppNavigator from "./src/navigation/AppNavigator";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Toast from "react-native-toast-message";
import { toastConfig } from "toastConfig";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <NavigationContainer>
            <View style={styles.container}>
              <StatusBar style="auto" />
              <AppNavigator />
              <Toast position="top" config={toastConfig} />
            </View>
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
