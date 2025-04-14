import { View, Text } from "react-native";
import React, { useEffect } from "react";
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
    };
    checkAuth();
  }, [dispatch, isAuthenticated]);

  if (!isFontsLoaded) {
    return null;
  }

  return isAuthenticated ? <TabNavigator /> : <AuthStack />;
}
