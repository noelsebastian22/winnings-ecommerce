import { AppState } from './app.state';
import { initialState as initialCartState } from '@core/state/cart/cart.reducer';
import { initialProductsState } from '@core/state/products';

describe('AppState', () => {
  it('can be constructed from slice initial states', () => {
    const state: AppState = {
      cart: initialCartState,
      products: initialProductsState,
    };

    expect(state.cart).toBe(initialCartState);
    expect(state.products).toBe(initialProductsState);
  });
});
