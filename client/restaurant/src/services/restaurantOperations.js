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

export const handleGetAllMenus = async (restaurantId, token, dispatch) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/restaurant/menus?restaurantId=${restaurantId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      dispatch({
        type: "SET_MENUS",
        payload: response.data.menu,
      });
      return response.data;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const handleAddMenuItem = async (
  restaurantId,
  token,
  item,
  dispatch
) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/restaurant/menu/add`,
      {
        restaurantId,
        item,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200 || response.status === 201) {
      handleGetAllMenus(restaurantId, token, dispatch);
      return response.data;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const handleUpdateMenuItem = async (
  restaurantId,
  token,
  itemId,
  updatedItem,
  dispatch
) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/restaurant/menu/update`,
      {
        restaurantId,
        itemId,
        updatedItem,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      handleGetAllMenus(restaurantId, token, dispatch);
      return response.data;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const handleDeleteMenuItem = async (
  restaurantId,
  token,
  itemId,
  dispatch
) => {
  try {
    const response = await axios.delete(
      `${API_URL}/api/restaurant/menu/delete`,
      {
        data: {
          restaurantId,
          itemId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      handleGetAllMenus(restaurantId, token, dispatch);
      return response.data;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const handleGetAllTables = async (restaurantId, token, dispatch) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/restaurant/tables?restaurantId=${restaurantId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      dispatch({
        type: "SET_TABLES",
        payload: response.data.tables,
      });
      return response.data;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const handleAddTable = async (restaurantId, token, table, dispatch) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/restaurant/table/add`,
      {
        restaurantId,
        tableName: table.tableName,
        capacity: table.capacity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200 || response.status === 201) {
      handleGetAllTables(restaurantId, token, dispatch);
      return response.data;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const handleEditTable = async (
  restaurantId,
  token,
  tableId,
  updatedTable,
  dispatch
) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/restaurant/table/update`,
      {
        restaurantId,
        tableId,
        updates: updatedTable,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      handleGetAllTables(restaurantId, token, dispatch);
      return response.data;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const handleDeleteTable = async (
  restaurantId,
  token,
  tableId,
  dispatch
) => {
  try {
    const response = await axios.delete(
      `${API_URL}/api/restaurant/table/delete`,
      {
        data: {
          restaurantId,
          tableId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      console.log("Table deleted successfully");
      handleGetAllTables(restaurantId, token, dispatch);
      return response.data;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const handleRestaurantUpdate = async (
  restaurantId,
  token,
  updatedRestaurant,
  dispatch
) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/restaurant/update`,
      {
        restaurantId,
        updatedRestaurant,
      },
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

export const handleRestaurantProfileUpdate = async (
  restaurantId,
  token,
  updatedRestaurantImage,
  dispatch
) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/restaurant/profile/update`,
      {
        restaurantId,
        updatedRestaurantImage,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200 || response.status === 201) {
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

export const handleUpdateRestaurantStatus = async (
  restaurantId,
  token,
  status,
  dispatch
) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/restaurant/update-status`,
      {
        restaurantId,
        status,
      },
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
