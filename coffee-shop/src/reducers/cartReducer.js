import { useReducer } from 'react';

const initialCart = [];

export const CartTypes = {
  ADD: 'ADD',
};

const findItem = (cart, itemId) => cart.find((item) => item.id === itemId);

const cartReducer = (state, action) => {
  switch (action.type) {
    case CartTypes.ADD:
      if (findItem(state, action.itemId)) {
        return state.map((item) => {
          if (item.id !== action.itemId) {
            return item;
          }
          return { ...item, quantity: item.quantity + 1 };
        });
      }
      return [...state, { id: action.itemId, quantity: 1 }];
    default:
      throw new Error(`cartReducer: Invalid action type ${action.type}`);
  }
};

export const useCartReducer = () => useReducer(cartReducer, initialCart);