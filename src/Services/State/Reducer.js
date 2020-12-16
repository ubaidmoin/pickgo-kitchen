export const actions = {
  SET_USER: 'set_user',
  SET_ORDERS: 'set_orders',
};

export const reducer = (state, action) => {
  switch (action.type) {
    case actions.SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case actions.SET_ORDERS:
      return {
        ...state,
        allOrders: action.payload,
      };
    default:
      return state;
  }
};
