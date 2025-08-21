import { Action } from '@ngrx/store';
import { AppState } from './app.state';

import {
  cartReducer,
  initialState as initialCartState,
  CartState,
} from '@core/state/cart/cart.reducer';

import {
  productsReducer,
  initialProductsState,
  ProductsState,
} from '@core/state/products';
import { reducers } from './app.reducer';

describe('root reducers (ActionReducerMap<AppState>)', () => {
  it('exposes expected slice keys', () => {
    expect(Object.keys(reducers).sort()).toEqual(['cart', 'products']);
  });

  it('maps slices to the correct reducer functions', () => {
    expect(reducers.cart).toBe(cartReducer);
    expect(reducers.products).toBe(productsReducer);
  });

  it('each slice reducer returns its initial state on @ngrx/store/init', () => {
    const initAction: Action = { type: '@ngrx/store/init' };

    const cartInit = reducers.cart(
      undefined as unknown as CartState,
      initAction,
    );
    const productsInit = reducers.products(
      undefined as unknown as ProductsState,
      initAction,
    );

    expect(cartInit).toEqual(initialCartState);
    expect(productsInit).toEqual(initialProductsState);
  });

  it('no-op action leaves slice state unchanged', () => {
    const noop: Action = { type: '[Test] Noop' };

    const cartNext = reducers.cart(initialCartState, noop);
    const productsNext = reducers.products(initialProductsState, noop);

    expect(cartNext).toBe(initialCartState);
    expect(productsNext).toBe(initialProductsState);
  });

  it('can compose an AppState from slice initial states (type sanity)', () => {
    const state: AppState = {
      cart: initialCartState,
      products: initialProductsState,
    };
    expect(state).toMatchObject({
      cart: initialCartState,
      products: initialProductsState,
    });
  });
});
