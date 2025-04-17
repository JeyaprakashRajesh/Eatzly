const initialState = {
  isAuthenticated: false,
  id: null,
  token: null,
  loading: false,
  error: null,
};

export default authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_AUTH":
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        id: action.payload.id,
        token: action.payload.token,
      };
    case "SET_AUTH_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "SET_AUTH_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};
