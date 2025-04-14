import axios from "axios";
import { API_URL } from "@/constants/env";
import  AsyncStorage  from "@react-native-async-storage/async-storage";

export const register = async (formData, dispatch) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/restaurant/register`,
      formData
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const login = async (phone, otp, dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/api/restaurant/login`, {
      phone,
      otp,
    });
    if (response.status === 200) {
      if (response.data.restaurant && response.data.token) {
        dispatch({
          type: "SET_AUTH",
          payload: {
            isAuthenticated: true,
            id: response.data.restaurant._id,
            token: response.data.token,
          },
        });
        AsyncStorage.setItem("token", response.data.token);
      }
    }
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
