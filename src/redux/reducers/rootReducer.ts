import { combineReducers } from "redux";
import cartReducer from "./cartReducer";
import orderHistoryReducer from "./orderHistoryReducer";
import productsReducer from "./productsReducer";

const rootReducer = combineReducers({
  cart: cartReducer,
  orderHistory: orderHistoryReducer,
  products: productsReducer,
});

export default rootReducer;
