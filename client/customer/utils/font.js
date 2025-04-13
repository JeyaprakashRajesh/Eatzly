import * as Font from 'expo-font';

export async function loadFonts(setFontsLoaded) { 
  try {
    await Font.loadAsync({
      'montserrat-regular': require('../assets/fonts/Montserrat-Regular.ttf'),
      'montserrat-medium': require('../assets/fonts/Montserrat-Medium.ttf'),
      'montserrat-semibold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
      'montserrat-bold': require('../assets/fonts/Montserrat-Bold.ttf'),
      'baloo-regular' : require("../assets/fonts/BalooBhaijaan2-Regular.ttf"),
      'baloo-medium' : require("../assets/fonts/BalooBhaijaan2-Medium.ttf"),
      'baloo-bold' : require("../assets/fonts/BalooBhaijaan2-Bold.ttf"),
      'baloo-SemiBold' : require("../assets/fonts/BalooBhaijaan2-SemiBold.ttf")
    });
    if (setFontsLoaded) { 
      setFontsLoaded(true);
    }
  } catch (error) {
    console.error('Error loading fonts:', error);
    if (setFontsLoaded) {
      setFontsLoaded(false);
    }
  }
}