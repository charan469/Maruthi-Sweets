// /redux/actions/cartActions.ts

export const ADD_ITEM = 'ADD_ITEM';
export const REMOVE_ITEM = 'REMOVE_ITEM';
export const UPDATE_QUANTITY = 'UPDATE_QUANTITY';

// Action to add item to the cart
interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface AddItemAction {
    type: typeof ADD_ITEM;
    payload: CartItem;
}

export const addItemToCart = (item: CartItem): AddItemAction => {
    return {
        type: ADD_ITEM,
        payload: item,
    };
};

// Action to remove item from the cart
interface RemoveItemAction {
    type: typeof REMOVE_ITEM;
    payload: CartItem;
}

export const removeItemFromCart = (itemName: string) => {
    return {
        type: REMOVE_ITEM,
        payload: itemName,
    };
};

// Action to update the quantity of an item in the cart
interface UpdateQuantityAction {
    type: typeof UPDATE_QUANTITY;
    payload: {
        item: CartItem;
        quantity: number;
    };
}

export const updateItemQuantity = (item: CartItem, quantity: number): UpdateQuantityAction => {
    return {
        type: UPDATE_QUANTITY,
        payload: { item, quantity },
    };
};
