import { Product } from '@infrastructure/models';
import { createAction, props } from '@ngrx/store';

export const addToCart = createAction(
  '[Cart] Add To Cart',
  props<{ product: Product }>(),
);

export const removeFromCart = createAction(
  '[Cart] Remove From Cart',
  props<{ productSku: string }>(),
);

export const updateQuantity = createAction(
  '[Cart] Update Quantity',
  props<{ productSku: string; quantity: number }>(),
);

export const clearCart = createAction('[Cart] Clear Cart');
