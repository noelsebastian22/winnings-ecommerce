import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { cartReducer } from '@core/state/cart/cart.reducer';
import { productsReducer } from '@core/state/products';

export const reducers: ActionReducerMap<AppState> = {
  cart: cartReducer,
  products: productsReducer,
};
