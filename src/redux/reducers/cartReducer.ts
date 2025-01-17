// /redux/reducers/cartReducer.ts

import { ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY } from '../actions/cartActions';

interface CartItem {
  name: string;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
}

const initialState: CartState = {
  cart: [],
};

const cartReducer = (state = initialState, action: { type: string; payload: any }) => {
  switch (action.type) {
    case ADD_ITEM:
      const itemIndex = state.cart.findIndex(item => item.name === action.payload.name);
      if (itemIndex >= 0) {
        // Item exists, update quantity
        const updatedCart = [...state.cart];
        updatedCart[itemIndex].quantity += 1;
        return { ...state, cart: updatedCart };
      } else {
        // Item doesn't exist, add to cart with quantity 1
        return { ...state, cart: [...state.cart, { ...action.payload, quantity: 1 }] };
      }

    case REMOVE_ITEM:
      return { ...state, cart: state.cart.filter(item => item.name !== action.payload) };

    case UPDATE_QUANTITY:
      return {
        ...state,
        cart: state.cart.map(item =>
          item.name === action.payload.item.name
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    default:
      return state;
  }
};

export default cartReducer;
