import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../utils/routes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { primary } from "../../utils/color";
import HomeStack from "./components/HomeStack";
import ExploreScreen from "./components/ExploreScreen";
import ProfileScreen from "./components/ProfileScreen";
import ReservationStack from "./components/ReservationStack";
import FavoritesScreen from "./components/FavoritesScreen";
import * as Location from "expo-location";

const Tab = createBottomTabNavigator();
const { height, width } = Dimensions.get("screen");

export default function MainScreen({ setIsAuthenticated }) {
  const [data, setData] = useState(null);
  const [newUser, setNewUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
  });

  const getCustomerDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("Token not found");
        setIsAuthenticated(false);
        return;
      }
      const response = await axios.get(
        `${BACKEND_URL}/api/customer/customer-data`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.customer);
      const data = response.data.customer;

      if (!data.username || !data.address) {
        setNewUser(true);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching customer details:", error);
      setIsLoading(false);
    }
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    console.log("Coords:", loc.coords);

    setLocation({
      lat: loc.coords.latitude,
      lng: loc.coords.longitude,
    });

    const geocode = await Location.reverseGeocodeAsync(loc.coords);
    const place = geocode[0];

    if (place) {
      const fullAddress = `${place.name}, ${place.street}, ${place.postalCode}, ${place.city}`;
      console.log("City:", place.city);
      console.log("Full Address:", fullAddress);

      setUsername(""); 
      setAddress(fullAddress);
      setCity(place.city);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("Token not found");
        setIsAuthenticated(false);
        return;
      }
      const response = await axios.put(
        `${BACKEND_URL}/api/customer/customer-data`,
        {
          username: username,
          address: address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.customer);
      setNewUser(false);
    } catch (error) {
      console.error("Error updating customer details:", error);
    }
  };

  useEffect(() => {
    getCustomerDetails();
    getLocation();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {newUser ? (
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <Text style={styles.welcomeText}>Welcome to EATZLY!</Text>
            <Text style={styles.welcomeDescription}>
              Fill the Below Details to get started with EATZLY. please provide
              your name, address
            </Text>
            <Text style={styles.welcomePhone}>
              Your Phone Number is <Text style={{ color: primary }}> {data?.phone} </Text>
            </Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={username}
                onChangeText={(text) => setUsername(text)}
                placeholderTextColor="#000"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your address"
                value={address}
                onChangeText={(text) => setAddress(text)}
                placeholderTextColor="#000"
              />
            </View>
          </View>
          <View style={styles.bottomContainer}>
            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              height: 70,
              paddingBottom: 10,
            },
            tabBarActiveTintColor: primary,
            tabBarInactiveTintColor: "black",
            tabBarLabelStyle: {
              color: "black",
              fontFamily: "montserrat-medium",
            },
            tabBarIcon: ({ focused, color }) => {
              let iconName;
              if (route.name === "Home") {
                iconName = require("../../assets/images/home.png");
              } else if (route.name === "Explore") {
                iconName = require("../../assets/images/explore.png");
              } else if (route.name === "Reservations") {
                iconName = require("../../assets/images/reservations.png");
              } else if (route.name === "Favorites") {
                iconName = require("../../assets/images/favorites.png");
              } else if (route.name === "Profile") {
                iconName = require("../../assets/images/profile.png");
              }
              return (
                <Image
                  source={iconName}
                  style={{ width: 24, height: 24, tintColor: color }}
                />
              );
            },
          })}
        >
          <Tab.Screen name="Home">
            {() => (
              <HomeStack
                data={data}
                location={location}
                city={city}
                address={address}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Explore">
            {() => <ExploreScreen data={data} />}
          </Tab.Screen>
          <Tab.Screen name="Reservations">
            {() => <ReservationStack data={data} />}
          </Tab.Screen>
          {/* <Tab.Screen name="Favorites">
            {() => <FavoritesScreen data={data} />}
          </Tab.Screen> */}
          <Tab.Screen name="Profile">
            {() => <ProfileScreen data={data} />}
          </Tab.Screen>
        </Tab.Navigator>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
  },
  topContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  welcomeText: {
    fontSize: width * 0.08,
    fontFamily: "baloo-bold",
    color: "#000",
  },
  welcomeDescription: {
    fontSize: width * 0.035,
    fontFamily: "montserrat-semibold",
    paddingTop: 5,
    color: "#000",
  },
  welcomePhone: {
    fontSize: width * 0.035,
    fontFamily: "montserrat-medium",
    paddingTop: height * 0.03,
    marginBottom: height * 0.03,
    color: "#000",
  },
  inputContainer: {
    marginVertical: height * 0.02,
  },
  inputLabel: {
    fontSize: width * 0.035,
    fontFamily: "montserrat-semibold",
    paddingBottom: 5,
    color: "#000",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: height * 0.06,
    fontSize: width * 0.035,
    fontFamily: "montserrat-medium",
    borderWidth: 2,
    borderColor: primary,
    color: "#000",
  },
  bottomContainer: {
    height: height * 0.1,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10000,
    width: width * 0.8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.05,
    fontFamily: "baloo-bold",
    textAlign: "center",
  },
});
