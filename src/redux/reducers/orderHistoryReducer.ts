const SAVE_ORDER = "SAVE_ORDER";

export const saveOrder = (orderDetails: any) => {
  return {
    type: SAVE_ORDER,
    payload: orderDetails,
  };
};

interface OrderState {
  orderHistory: any[];
}

const initialState: OrderState = {
  orderHistory: [],
};

const orderHistoryReducer = (state = initialState, action: { type: string; payload: any }) => {
  switch (action.type) {
    case SAVE_ORDER:
      return {
        ...state,
        orderHistory: [...state.orderHistory, action.payload],
      };

    default:
      return state;
  }
};

export default orderHistoryReducer;
