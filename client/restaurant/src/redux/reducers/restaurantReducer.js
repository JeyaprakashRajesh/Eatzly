const initialState = {
  restaurant: null,
  loading: false,
  error: null,
  tables: [],
  menus: [],
  orders: [],
};

export default restaurantReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_RESTAURANT":
      return {
        ...state,
        restaurant: action.payload,
      };
    case "SET_RESTAURANT_ERROR":
      return {
        ...state,
        restaurantError: action.payload,
      };
    case "SET_RESTAURANT_LOADING":
      return {
        ...state,
        restaurantLoading: action.payload,
      };
    case "SET_TABLES":
      return {
        ...state,
        tables: action.payload,
      };
    case "SET_MENUS":
      return {
        ...state,
        menus: action.payload,
      };
    case "SET_ORDERS":
      return {
        ...state,
        orders: action.payload,
      };
    default:
      return state;
  }
};
