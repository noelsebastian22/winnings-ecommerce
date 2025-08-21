import { CartState } from '@core/state/cart/cart.reducer';
import { ProductsState } from '@core/state/products';

export interface AppState {
  cart: CartState;
  products: ProductsState;
}
