import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Home/HomeScreen';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../../utils/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, } from 'react-native';
import RestaurantDetails from './Home/RestaurantDescription';
const Stack = createNativeStackNavigator();

const HomeStack = ({ data }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    useEffect(() => {

        const tRestaurants = async () => {
            const token = await AsyncStorage.getItem('token');
            try {
                const response = await axios.get(`${BACKEND_URL}/api/customer/restaurants`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRestaurants(response.data.restaurants);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching restaurants:", error);
                setIsLoading(false);
            }
        }
        tRestaurants();
    }, [])
    if (isLoading) {
        return <View>
            <Text>Loading...</Text>
        </View>
    }
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                initialParams={{ data, restaurants, setSelectedRestaurant }}
            />
            <Stack.Screen
                name="RestaurantDetails"
                component={RestaurantDetails}
                
            />
        </Stack.Navigator>
    );
};

export default HomeStack;
