
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { primary, lightgray, lightgray2,  } from '../../../../utils/color';
const { height, width } = Dimensions.get("screen");

const HomeScreen = ({ route, navigation}) => {
  const { data, reservations } = route.params;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.topContainer} onPress={() => navigation.navigate("ScanQR")}>
        <Image
          source={require('../../../../assets/images/add reservations.png')}
          style={styles.AddImage}
        />
        <Text style={styles.addText}>
          Click to scan QR and Add Reservation  
        </Text>
      </TouchableOpacity>
      <View style={styles.reservationContainer}>
        <Text style={styles.reservationHeading}>Reservations</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topContainer : {
    height : 250,
    width : width,
    alignItems : "center",
    justifyContent : "center",
    gap : 20,
    borderBottomColor : lightgray,
    borderBottomWidth : 1,
  },
  AddImage : {
    height : 100,
    width : 100
  },
  addText : {
    fontFamily:  "montserrat-semibold",
    fontSize : width * 0.04
  },
  reservationContainer : {
    width : width,
    paddingHorizontal : width * 0.05,
    paddingTop : height * 0.015,
  },
  reservationHeading : {
    fontFamily:  "baloo-bold",
    fontSize : width * 0.06
  }

});

export default HomeScreen;
