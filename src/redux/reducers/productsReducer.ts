interface Product {
  product_id: number;
  product_name: string;
  product_price: string;
  product_image_url: string;
  show_available: boolean;
}

interface ProductsState {
  products: Product[];
}

const initialState: ProductsState = {
  products: [],
};

const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_PRODUCTS":
      return {
        ...state,
        products: action.payload,
      };

    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter(
          (product) => product.product_id !== action.payload
        ),
      };

    case "UPDATE_PRODUCT_AVAILABILITY":
      return {
        ...state,
        products: state.products.map((product) =>
          product.product_id === action.payload.productId
            ? { ...product, show_available: action.payload.newStatus }
            : product
        ),
      };

    case "ADD_NEW_PRODUCT":
      return{
        ...state,
        products: [...state.products, action.payload],
      }  

    default:
      return state;
  }
};

export default productsReducer;
