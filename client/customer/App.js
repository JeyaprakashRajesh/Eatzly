import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthScreen from "./screens/AuthScreen/AuthScreen";
import MainScreen from "./screens/MainScreen/MainScreen";
import { loadFonts } from "./utils/font";


const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      await loadFonts(setFontsLoaded);
      const token = await AsyncStorage.getItem("token");
      setIsAuthenticated(token ? true : false);
    };
    checkToken();
  }, []);

  if (isAuthenticated === null || !fontsLoaded) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainScreen} />
        ) : (
          <Stack.Screen name="Login">
            {(props) => <AuthScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
