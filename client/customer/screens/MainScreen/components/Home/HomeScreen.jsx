import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  TextInput,
  Animated,
  ScrollView,
} from "react-native";
import {
  primary,
  lightgray2,
  lightgray,
  lightText,
  lightblack,
} from "../../../../utils/color";
import Dosa from "../../../../assets/images/dosa.jpg"
import Idli from "../../../../assets/images/idli.jpeg"
import Vada from "../../../../assets/images/vada.jpg"
import Uttapam from "../../../../assets/images/uttappam.png"
import Pongal from "../../../../assets/images/ven-pongal.jpg"
import Upma from "../../../../assets/images/upma.jpg"
import Parotta from "../../../../assets/images/parotta.jpg"
import Biriyani from "../../../../assets/images/biriyani.jpg"
import Chappathi from "../../../../assets/images/chapati.jpeg"
import Naan from "../../../../assets/images/naan.jpeg"








const { height, width } = Dimensions.get("screen");

const HomeScreen = ({
  navigation,
  data,
  restaurants,
  setSelectedRestaurant,
  location,
  city,
  address,
}) => {
  console.log("Home Screen", city, address);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchText, setSearchText] = useState("");
  const bannerRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const CATEGORY_ITEM_WIDTH = 80;
  console.log(restaurants[0].image);

  // const categories = [
  //   { name: "Dosa", imageUrl: Dosa },
  //   { name: "Idli", imageUrl: Idli },
  //   { name: "Vada", imageUrl: Vada },
  //   { name: "Uttapam", imageUrl: Uttapam },
  //   { name: "Pongal", imageUrl: Pongal },
  //   { name: "Upma", imageUrl: Upma },
  //   { name: "Parotta", imageUrl: Parotta },
  //   { name: "Biriyani", imageUrl: Biriyani },
  //   { name: "Chappathi", imageUrl: Chappathi },
  //   { name: "Naan", imageUrl: Naan },
  // ];
  const categories = [
    { name: "Dosa", imageUrl: require("../../../../assets/images/dosa.jpg") },
    { name: "Idli", imageUrl: require("../../../../assets/images/idli.jpeg") },
    { name: "Vada", imageUrl: require("../../../../assets/images/vada.jpg") },
    { name: "Uttapam", imageUrl: require("../../../../assets/images/uttappam.png") },
    { name: "Pongal", imageUrl: require("../../../../assets/images/ven-pongal.jpg") },
    { name: "Upma", imageUrl: require("../../../../assets/images/upma.jpg") },
    { name: "Parotta", imageUrl: require("../../../../assets/images/parotta.jpg") },
    { name: "Biriyani", imageUrl: require("../../../../assets/images/biriyani.jpg") },
    { name: "Chappathi", imageUrl: require("../../../../assets/images/chapati.jpeg") },
    { name: "Naan", imageUrl: require("../../../../assets/images/naan.jpeg") },
  ];
  
  const banners = [
    require("../../../../assets/images/banner1.jpg"),
    require("../../../../assets/images/banner2.jpg"),
    require("../../../../assets/images/banner3.jpg"),
  ];

  const handleScroll = (event) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <View style={styles.headingContainer}>
        <Text style={styles.headingText}>EATZLY</Text>
        <TouchableOpacity>
          <Image
            source={require("../../../../assets/images/mani.png")}
            style={styles.headingImage}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchbar}>
          <Image
            source={require("../../../../assets/images/search.png")}
            style={styles.searchIcon}
            resizeMode="contain"
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#000"
          />
        </View>
        <TouchableOpacity onPress={()=>{
          navigation.navigate("Reservations")
        }} style={styles.qrContainer}>
          <Image
            source={require("../../../../assets/images/qr.png")}
            style={styles.qrIcon}
          />
          <Text style={styles.qrText}>SCAN-QR</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bannerContainer}>
        <FlatList
          ref={bannerRef}
          data={banners}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={handleScroll}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <Image
              source={item}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          )}
        />
        <View style={styles.pagination}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: activeIndex === index ? primary : lightgray2,
                },
              ]}
            />
          ))}
        </View>
      </View>
      <View style={styles.locationContainer}>
        <View style={styles.locationLeftContainer}>
          <Text style={styles.locationTextContainer}>Current Location</Text>
          <View style={styles.locationHeader}>
            <Image
              source={require("../../../../assets/images/location.png")}
              style={styles.locationIcon}
              resizeMode="contain"
            />
            <Text style={styles.locationPlace}>{city}</Text>
          </View>
          <View style={styles.locationAddress}>
            <Text style={styles.locationAddressText}>{address}</Text>
          </View>
        </View>
        <View style={styles.locationRightContainer}>
          <TouchableOpacity>
            <Image
              source={require("../../../../assets/images/down arrow.png")}
              style={styles.locationArrow}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.categoryContainer}>
        <View style={styles.categoryHeader}>
          <Image
            source={require("../../../../assets/images/left-design.png")}
            style={styles.categoryDesign}
            resizeMode="contain"
          />
          <Text style={styles.categoryHeaderText}>Top Categories</Text>
          <Image
            source={require("../../../../assets/images/right-design.png")}
            style={styles.categoryDesign}
            resizeMode="contain"
          />
        </View>
        <FlatList
  data={categories}
  horizontal
  showsHorizontalScrollIndicator={false}
  keyExtractor={(item, index) => index.toString()}
  contentContainerStyle={{ paddingHorizontal: 20 }}
  bounces={false}
  onScroll={Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  )}
  renderItem={({ item }) => (
    <View style={styles.categoryItem}>
      <View style={styles.categoryIcon}>
        <Image
          source={item.imageUrl} // Now using the require path
          style={styles.categoryImage}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.categoryText}>{item.name}</Text>
    </View>
  )}
/>

        <View style={styles.scrollTrack}>
          <Animated.View
            style={[
              styles.scrollThumb,
              {
                transform: [
                  {
                    translateX: scrollX.interpolate({
                      inputRange: [0, CATEGORY_ITEM_WIDTH * 5],
                      outputRange: [0, width - 80],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.restaurantContainer}>
        <Text style={styles.restaurantHeader}>Recommended Restaurants</Text>
        {restaurants &&
          restaurants.map((restaurant, index) => (
            <TouchableOpacity
              key={index}
              style={styles.restaurantItem}
              onPress={() => {
                navigation.navigate("RestaurantDetails", { restaurant });
              }}
            >
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
                  <Text style={styles.restaurantAddress}>
                    <Text style={styles.restaurantAddressText}>
                      {restaurant.city},{restaurant.state} -{" "}
                      {restaurant.pincode}
                    </Text>
                  </Text>
                </View>
              </View>
              <View style={styles.restaurantRatingContainer}>
                <Image
                  source={require("../../../../assets/images/rating 5 star.png")}
                  style={styles.ratingImage}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 50,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: height * 0.01,
    paddingHorizontal: width * 0.05,
  },
  headingText: {
    fontSize: width * 0.08,
    fontFamily: "baloo-bold",
    color: "black",
  },
  headingImage: {
    height: width * 0.08,
    width: width * 0.08,
  },
  bannerContainer: {
    height: height * 0.2,
    marginTop: height * 0.02,
    marginRight: 25,
  },
  bannerImage: {
    width: width - 50,
    marginLeft: 25,
    height: "90%",
    borderRadius: 20,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    width: "100%",
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    gap: width * 0.05,
  },
  searchbar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: lightgray2,
    borderRadius: 11,
    height: 50,
    paddingHorizontal: width * 0.04,
    flex: 1,
  },
  searchIcon: {
    height: 20,
    width: 20,
    marginRight: width * 0.04,
  },
  searchInput: {
    fontFamily: "montserrat-medium",
  },
  qrContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: primary,
    borderRadius: 11,
    height: 50,
    width: 140,
  },
  qrIcon: {
    height: 30,
    width: 30,
  },
  qrText: {
    fontSize: 17,
    fontFamily: "baloo-bold",
    color: "#fff",
  },
  categoryContainer: {},
  categoryItem: {
    alignItems: "center",
    marginRight: 20,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: lightgray2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius : 10
  },
  categoryText: {
    fontSize: 12,
    fontFamily: "montserrat-semibold",
    color: "black",
  },
  scrollTrack: {
    height: 4,
    backgroundColor: lightgray2,
    marginTop: 10,
    marginHorizontal: 20,
    borderRadius: 2,
    overflow: "hidden",
  },
  scrollThumb: {
    height: 4,
    width: 40,
    backgroundColor: primary,
    borderRadius: 2,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.01,
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
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.05,
    height: 90,
    marginTop: height * 0.01,
    marginBottom: height * 0.01,
  },
  locationLeftContainer: {
    flexDirection: "column",
    flex: 1,
  },
  locationRightContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: 80,
  },
  locationTextContainer: {
    fontFamily: "montserrat-medium",
    fontSize: width * 0.03,
  },
  locationIcon: {
    height: 30,
    width: 30,
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationPlace: {
    fontFamily: "baloo-bold",
    fontSize: width * 0.06,
    marginLeft: width * 0.02,
  },
  locationAddressText: {
    fontFamily: "montserrat-medium",
    fontSize: width * 0.03,
  },
  locationArrow: {
    height: 20,
    width: 20,
  },
  restaurantContainer: {
    paddingHorizontal: width * 0.03,
    marginBottom: height * 0.02,
    marginTop: height * 0.03,
  },
  restaurantHeader: {
    fontFamily: "baloo-bold",
    fontSize: width * 0.045,
    color: lightText,
  },
  restaurantItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: height * 0.02,
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
    gap: 10,
  },
  typeImage: {
    height: 20,
    width: 20,
  },
  restaurantAddressText: {
    fontFamily: "montserrat-medium",
    fontSize: width * 0.03,
    color: lightText,
    marginTop: 10,
  },
  restaurantAddress: {
    marginTop: 10,
  },
  ratingImage: {
    height: 50,
    width: 60,
  },
  restaurantImage: {
    height : "100%",
    width : "100%",
    borderRadius : 20
  },
});

export default HomeScreen;
