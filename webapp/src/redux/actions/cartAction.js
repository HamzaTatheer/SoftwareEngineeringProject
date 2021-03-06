export const ADD_TO_CART = "ADD_TO_CART";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";
export const CLEAR_CART = "CLEAR_CART";
export const SELECT_CART_ITEM = "SELECT_CART_ITEM";

export const selectCartItem = (item_id, name, price) => {
  return {
    type: SELECT_CART_ITEM,
    payload: { id: item_id, name, price },
  };
};

export const addToCart = (item_id) => {
  return {
    type: ADD_TO_CART,
    payload: item_id,
  };
};

export const removeFromCart = (item_id) => {
  return {
    type: REMOVE_FROM_CART,
    payload: item_id,
  };
};

export const clearCart = () => {
  return {
    type: CLEAR_CART,
    payload: null,
  };
};
