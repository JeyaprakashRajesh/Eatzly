const initialState = {
  restaurant: null,
  loading: false,
  error: null,
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
    default:
      return state;
  }
};
