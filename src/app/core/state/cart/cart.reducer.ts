import { createReducer, on } from '@ngrx/store';
import * as CartActions from './cart.actions';
import { CartItem } from '@infrastructure/models';

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

export const cartReducer = createReducer(
  initialState,
  on(CartActions.addToCart, (state, { product }) => {
    const existingItem = state.items.find(
      (item) => item.product.sku === product.sku,
    );

    let newItems: CartItem[];
    if (existingItem) {
      newItems = state.items.map((item) =>
        item.product.sku === product.sku
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
    } else {
      newItems = [...state.items, { product, quantity: 1 }];
    }

    const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = newItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    return {
      ...state,
      items: newItems,
      totalItems,
      totalPrice,
    };
  }),

  on(CartActions.removeFromCart, (state, { productSku }) => {
    const newItems = state.items.filter(
      (item) => item.product.sku !== productSku,
    );
    const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = newItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    return {
      ...state,
      items: newItems,
      totalItems,
      totalPrice,
    };
  }),

  on(CartActions.clearCart, () => initialState),
);
