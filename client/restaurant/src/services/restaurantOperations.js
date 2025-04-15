import axios from "axios";
import { API_URL } from "@/constants/env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getRestaurant = async (token, dispatch) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/restaurant/get-restaurant`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      dispatch({
        type: "SET_RESTAURANT",
        payload: response.data.restaurant,
      });
      return response.data;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
