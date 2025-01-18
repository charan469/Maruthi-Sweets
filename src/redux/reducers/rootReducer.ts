import { combineReducers } from "redux";
import cartReducer from "./cartReducer";
import orderHistoryReducer from "./orderHistoryReducer";

const rootReducer = combineReducers({
  cart: cartReducer,
  orderHistory: orderHistoryReducer, // Add order history reducer
});

export default rootReducer;
