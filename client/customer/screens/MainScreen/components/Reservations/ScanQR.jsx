import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { primary } from '../../../../utils/color';

const { width, height } = Dimensions.get('screen');

export default function QrScanner({ route, navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const { qr, setQr } = route.params;

  const handleBarcodeScanned = ({ data }) => {
    console.log("Scanned QR:", data);
    setQr(data);
    navigation.navigate("ConfirmReservation", { qr: data });
  };
  

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { paddingHorizontal : 20}]}>
        <Text style={styles.permissionText}>Allow Access to Camera for Scanning QR-CODE</Text>
        <TouchableOpacity  onPress={requestPermission} style={styles.permissionButton}>
            <Text style={styles.permissionButtonText}>Allow</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={handleBarcodeScanned}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",

  },
  camera: {
    flex: 1,
  },
  scannedText: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    fontSize: 18,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
  },
  permissionText: {
    fontSize: width * 0.045,
    fontFamily: 'montserrat-semibold',
  },
  permissionButton: {
    height : 50,
    backgroundColor: primary,
    alignItems : "center",
    justifyContent:"center",
    borderRadius : 10,
    marginTop : height * 0.03
  },
  permissionButtonText: {
    fontSize: width * 0.04,
    fontFamily: 'montserrat-bold',
    color : "white"
  }
});
