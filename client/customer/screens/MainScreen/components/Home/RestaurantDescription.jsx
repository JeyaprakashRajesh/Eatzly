
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { primary, lightgray2, lightgray, lightText, lightblack } from "../../../../utils/color";
import { BACKEND_URL } from "../../../../utils/routes";
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import { Linking, Platform } from 'react-native';




const { height, width } = Dimensions.get("screen");

const RestaurantDetails = ({ route, navigation }) => {
  const [menu, setMenu] = useState({})
  const { restaurant } = route.params;
  const offers = [
    {
      id: 1,
      icon: require("../../../../assets/images/offers.png"),
      text: "Get flat ₹200 when ordering above ₹2000",
    },
    {
      id: 2,
      icon: require("../../../../assets/images/offers.png"),
      text: "Free dessert on orders above ₹500",
    },
    {
      id: 3,
      icon: require("../../../../assets/images/offers.png"),
      text: "Buy 1 Get 1 Free on selected items",
    },
  ];

  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/customer/restaurant-menu/${restaurant._id}`);
        setMenu(response.data.menu)
      } catch (error) {
        console.log(error)
      }
    }
    fetchMenu()
  }, [])
  const openDirections = () => {
    const { lat, lng } = restaurant.coordinates;
  
    // Google Maps URL scheme
    const googleMapsUrl = `comgooglemaps://?daddr=${lat},${lng}`;
    
    // Apple Maps URL scheme
    const appleMapsUrl = `http://maps.apple.com/?daddr=${lat},${lng}`;
    
    // Check if Google Maps is available on iOS, otherwise fall back to Apple Maps
    Linking.canOpenURL('comgooglemaps://')
      .then((supported) => {
        const url = supported ? googleMapsUrl : appleMapsUrl;
        Linking.openURL(url).catch((err) => console.error("Error opening maps:", err));
      })
      .catch((err) => {
        // If there's an error checking for Google Maps, just try Apple Maps
        console.error("Error checking for Google Maps:", err);
        Linking.openURL(appleMapsUrl).catch((err) => console.error("Error opening Apple Maps:", err));
      });
  };
  
  
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../../../../assets/images/down arrow.png")}
            style={styles.backArrow}
            resizeMode='contain'
          />
          <Text style={styles.headingText}>Eatzly</Text>
        </TouchableOpacity>
        <View style={styles.topInnerContainer}>
          <View style={styles.detailsContainer}>
            <View style={styles.restaurantImageContainer}>
              <Image
                                  source={require("../../../../assets/images/image.png")}
                                  style={styles.restaurantImage}
                                  resizeMode="cover"
                                />
            </View>
            <View style={styles.restaurantDetails}>
              <Text style={styles.restaurantname}>{restaurant.name}</Text>
              <View style={styles.restaurantType}>
                <Image
                  source={require("../../../../assets/images/veg.png")}
                  style={styles.typeImage}
                  resizeMode="contain"
                />
                <Image
                  source={require("../../../../assets/images/non-veg.png")}
                  style={styles.typeImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.restaurantAddress}><Text style={styles.restaurantAddressText}>{restaurant.city},{restaurant.state} - {restaurant.pincode}</Text></Text>
            </View>
          </View>
          <View style={styles.restaurantRatingContainer}>
            <Image
              source={require("../../../../assets/images/rating 5 star.png")}
              style={styles.ratingImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
      <View style={styles.categoryHeader}>
        <Image
          source={require("../../../../assets/images/left-design.png")}
          style={styles.categoryDesign}
          resizeMode="contain"
        />
        <Text style={styles.categoryHeaderText}>
          Offers
        </Text>
        <Image
          source={require("../../../../assets/images/right-design.png")}
          style={styles.categoryDesign}
          resizeMode="contain"
        />
      </View>
      <View style={styles.offersScrollContainer}>
        <FlatList
          data={offers}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          pagingEnabled
          snapToAlignment="center"
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.offersScrollContainer}
          renderItem={({ item }) => (
            <View style={styles.offerCard}>
              <Image source={item.icon} style={styles.offerIcon} resizeMode="contain" />
              <Text style={styles.offerText}>{item.text}</Text>
            </View>
          )}
        />
      </View>
      <View style={styles.mapContainer}>
  {restaurant?.coordinates?.lat && restaurant?.coordinates?.lng && (
    <MapView
      style={StyleSheet.absoluteFillObject}
      initialRegion={{
        latitude: restaurant.coordinates.lat,
        longitude: restaurant.coordinates.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      <Marker
        coordinate={{
          latitude: restaurant.coordinates.lat,
          longitude: restaurant.coordinates.lng,
        }}
        title={restaurant.name}
        description={`${restaurant.city}, ${restaurant.state}`}
      />
    </MapView>
  )}
</View>

      <View style={styles.directionsContainer}>
      <TouchableOpacity onPress={openDirections} style={styles.directionsButton}>
  <Image
    source={require("../../../../assets/images/directions.png")}
    style={styles.directionsImage}
    resizeMode="contain"
  />
  <Text style={styles.directionsText}>Get Directions</Text>
</TouchableOpacity>

        <View style={styles.status}>
          <Text style={styles.statusText}><Text style={{ color: "green" }}>Opened</Text> closes by 10pm</Text>
        </View>
      </View>
      <View style={styles.categoryHeader}>
        <Image
          source={require("../../../../assets/images/left-design.png")}
          style={styles.categoryDesign}
          resizeMode="contain"
        />
        <Text style={styles.categoryHeaderText}>
          Menu
        </Text>
        <Image
          source={require("../../../../assets/images/right-design.png")}
          style={styles.categoryDesign}
          resizeMode="contain"
        />
      </View>
      <View style={styles.searchContainer}>
        <Image
          source={require("../../../../assets/images/search.png")}
          style={styles.searchIcon}
          resizeMode="contain"
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for food or restaurants"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <View style={styles.menuContainer}>
        {menu.items && menu.items
          .filter((item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase())
          )
          .map((item) => (
            <View key={item._id} style={styles.menuItemCard}>
              <View style={styles.menuItemContent}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.menuItemImage}
                  alt='image'
                  resizeMode="cover"
                />
                <View style={{marginLeft: 10}}>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                  <Text style={styles.menuItemDescription}>{item.category}</Text>
                  <Image
                    source={
                      item.type === "veg"
                        ? require("../../../../assets/images/veg.png")
                        : require("../../../../assets/images/non-veg.png")
                    }
                    style={styles.typeImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
              <View style={styles.menuItemPriceContainer}>
                <Text style={styles.menuItemPrice}>
                  ₹ {item.price}
                </Text>
              </View>
            </View>
          ))}

      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingBottom: 50,
  },

  topContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingBottom: 40,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 13,
    elevation: 6,
    zIndex: 1,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingHorizontal: 25
  },

  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: height * 0.01,
  },
  restaurantImageContainer: {
    width: width * 0.25,
    height: 150,
    borderRadius: 10,
  },
  restaurantDetails: {
    flexDirection: "column",
    marginLeft: width * 0.03,
  },
  restaurantname: {
    fontFamily: "baloo-bold",
    fontSize: width * 0.05,
    color: "black",
  },
  restaurantType: {
    flexDirection: "row",
    gap: 10
  },
  typeImage: {
    height: 20,
    width: 20,
  },
  restaurantAddressText: {
    fontFamily: "montserrat-medium",
    fontSize: width * 0.03,
    color: lightText,
    marginTop: 10
  },
  restaurantAddress: {
    marginTop: 10
  },
  ratingImage: {
    height: 50,
    width: 60
  },
  backArrow: {
    height: 40,
    width: 30,
    transform: [{ rotate: "90deg" }],
    overflow: "visible"
  },
  topInnerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: height * 0.01,
  },
  headingText: {
    fontFamily: "baloo-bold",
    fontSize: width * 0.06,
    marginLeft: width * 0.02,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.01,
    marginBottom: height * 0.01
  },
  categoryDesign: {
    width: width * 0.12,
    height: width * 0.12,
  },
  categoryHeaderText: {
    fontSize: width * 0.03,
    fontFamily: "montserrat-semibold",
    color: "black",
    marginLeft: width * 0.02,
    marginRight: width * 0.02,
  },
  offersScrollContainer: {
    marginBottom: height * 0.02,
  },
  offerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    borderRadius: 12,
    padding: 15,
    width: width - 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 25
  },
  offerIcon: {
    width: 30,
    height: 30,
    marginRight: 12,
  },
  offerText: {
    flex: 1,
    fontSize: width * 0.035,
    fontFamily: "montserrat-medium",
    color: "#333",
  },
  mapContainer: {
    marginHorizontal: width * 0.05,
    height: 150,
    backgroundColor: lightgray,
    borderRadius: 20
  },
  directionsContainer: {
    marginHorizontal: width * 0.05,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20
  },
  directionsButton: {
    backgroundColor: "#333333",
    height: 50,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15
  },
  directionsImage: {
    height: 20,
    width: 20,
  },
  directionsText: {
    fontFamily: "montserrat-semibold",
    color: 'white',
    marginLeft: 10,
    fontSize: width * 0.035,
  },
  statusText: {
    fontFamily: "montserrat-semibold",
    color: lightText,
    fontSize: width * 0.03,
  },
  searchContainer: {
    marginHorizontal: width * 0.05,
    height: 50,
    backgroundColor: lightgray2,
    borderRadius: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center"
  },
  searchIcon: {
    height: 20,
    width: 20,
  },
  searchInput: {
    flex: 1,
    fontFamily: "montserrat-medium",
    fontSize: width * 0.035,
    color: "#333",
    marginLeft: 10,

  },
  menuItemCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemImage: {
    height : 120,
    width: 120,
    borderRadius: 15
  },
  menuItemName: {
    fontFamily: "baloo-bold",
    fontSize: width * 0.06,
  },
  typeImage: {
    height: 20,
    width: 20,
    marginTop : 10
  },
  menuContainer: {
    marginTop : 40
  },
  menuItemPrice: {
    fontFamily: "montserrat-semibold",
    fontSize: width * 0.06,
    color: "black",
    marginTop: 10
  },
  mapContainer: {
    marginHorizontal: width * 0.05,
    height: 150,
    borderRadius: 20,
    overflow: 'hidden', // to clip the rounded corners
  },
  restaurantImage: {
    height : "100%",
    width : "100%",
    borderRadius : 20
  },
  menuItemPriceContainer: {}
  






});

export default RestaurantDetails;
