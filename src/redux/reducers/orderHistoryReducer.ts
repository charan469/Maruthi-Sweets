const SAVE_ORDER = "SAVE_ORDER";
const SAVE_ALL_ORDERS = "SAVE_ALL_ORDERS"

export const saveOrder = (orderDetails: any) => {
  return {
    type: SAVE_ORDER,
    payload: orderDetails,
  };
};

export const saveAllOrders = (response: any)=>{
  return {
    type: SAVE_ALL_ORDERS,
    payload: response
  }
}

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
    case SAVE_ALL_ORDERS:
      return {
        ...state,
        orderHistory: action.payload
      }

    default:
      return state;
  }
};

export default orderHistoryReducer;
