import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import TabNavigator from "./TabNavigator";
import AuthStack from "./stacks/AuthStack";
import useLoadFonts from "@/hooks/useLoadFonts";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getRestaurant } from "@/services/restaurantOperations";

export default function AppNavigator() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isFontsLoaded = useLoadFonts();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const restaurant = useSelector((state) => state.restaurant.restaurant);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        try {
          const response = await getRestaurant(token, dispatch);
          if (response.success) {
            dispatch({
              type: "SET_AUTH",
              payload: {
                isAuthenticated: true,
                id: response.restaurant._id,
                token: token,
              },
            });
          } else {
            dispatch({
              type: "SET_AUTH",
              payload: {
                isAuthenticated: false,
                id: null,
                token: null,
              },
            });
          }
        } catch (error) {
          console.log("Error in getRestaurant:", error);
          dispatch({
            type: "SET_AUTH",
            payload: {
              isAuthenticated: false,
              id: null,
              token: null,
            },
          });
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [dispatch, isAuthenticated]);

  if (!isFontsLoaded || (isAuthenticated && !restaurant)) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return isAuthenticated ? <TabNavigator /> : <AuthStack />;
}
