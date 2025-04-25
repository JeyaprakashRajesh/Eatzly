import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./Home/HomeScreen";
import RestaurantDetails from "./Home/RestaurantDescription";
import axios from "axios";
import { BACKEND_URL } from "../../../utils/routes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text } from "react-native";

const Stack = createNativeStackNavigator();

const HomeStack = ({ data, location, city, address }) => {
  console.log("HomeStack", city, address);
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const token = await AsyncStorage.getItem("token");
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/customer/restaurants`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRestaurants(response.data.restaurants);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setIsLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home">
  {(props) => (
    <HomeScreen
      {...props}
      data={data}
      restaurants={restaurants}
      setSelectedRestaurant={setSelectedRestaurant}
      location={location}
      city={city}
      address={address}
    />
  )}
</Stack.Screen>


      <Stack.Screen name="RestaurantDetails" component={RestaurantDetails} />
    </Stack.Navigator>
  );
};

export default HomeStack;
