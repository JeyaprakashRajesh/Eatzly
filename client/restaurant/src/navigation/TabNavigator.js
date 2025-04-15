import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "@/screens/main/Home";
import Orders from "@/screens/main/Orders";
import Menu from "@/screens/main/Menu";
import Settings from "@/screens/main/Settings";
import { Image } from "react-native";

import HomeIcon from "../../assets/icons/flowbite--home-solid.png";
import OrdersIcon from "../../assets/icons/material-symbols--restaurant-menu.png";
import MenuIcon from "../../assets/icons/bxs--food-menu.png";
import SettingsIcon from "../../assets/icons/ph--gear-six-fill.png";
import colors from "@/constants/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const Tab = createBottomTabNavigator();

const TabIcon = ({ source, color }) => (
  <Image
    source={source}
    style={{
      width: wp("3.5%"),
      height: hp("3.5%"),
      tintColor: color,
      aspectRatio: 1,
      resizeMode: "contain",
    }}
  />
);

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {},
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#555555",
        tabBarIconStyle: {
          marginTop: 10,
        },
      }}
      initialRouteName="Orders"
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <TabIcon source={HomeIcon} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={Orders}
        options={{
          tabBarIcon: ({ color }) => (
            <TabIcon source={OrdersIcon} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={Menu}
        options={{
          tabBarIcon: ({ color }) => (
            <TabIcon source={MenuIcon} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ color }) => (
            <TabIcon source={SettingsIcon} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
