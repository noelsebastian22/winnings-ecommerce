import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.reducer';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(
  selectCartState,
  (state: CartState) => state.items,
);

export const selectCartTotalItems = createSelector(
  selectCartState,
  (state: CartState) => state.totalItems,
);

export const selectCartTotalPrice = createSelector(
  selectCartState,
  (state: CartState) => state.totalPrice,
);

export const selectCartItemByProductSku = (productSku: string) =>
  createSelector(selectCartItems, (items) =>
    items.find((item) => item.product.sku === productSku),
  );
