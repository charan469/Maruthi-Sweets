const SET_PRODUCTS = "SET_PRODUCTS";
const DELETE_PRODUCT = "DELETE_PRODUCT";
const UPDATE_PRODUCT_AVAILABILITY = "UPDATE_PRODUCT_AVAILABILITY";
const ADD_NEW_PRODUCT = "ADD_NEW_PRODUCT"

// Action to save all products to state
export const setProducts = (products) => ({
  type: SET_PRODUCTS,
  payload: products,
});

// Action to delete a product based on product_id
export const deleteProduct = (productId) => ({
  type: DELETE_PRODUCT,
  payload: productId,
});

// Action to update show_available status for a product
export const updateProductAvailability = (productId, newStatus) => ({
  type: UPDATE_PRODUCT_AVAILABILITY,
  payload: { productId, newStatus },
});

// Action to add new product to state
export const addNewProduct = (newProduct) => ({
  type: ADD_NEW_PRODUCT,
  payload: newProduct,
});
