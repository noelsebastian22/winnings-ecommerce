import { Action, ActionReducer } from '@ngrx/store';
import { localStorageSyncReducer } from './local-storage-sync'; // ← adjust path
import { AppState } from '../../store'; // ← adjust path

import {
  CartState,
  initialState as initialCartState,
} from '@core/state/cart/cart.reducer'; // ← adjust path
import { ProductsState, initialProductsState } from '@core/state/products'; // ← adjust path

const initialAppState: AppState = {
  cart: initialCartState,
  products: initialProductsState,
};

// Minimal base reducer; keeps state stable for unknown actions.
const baseReducer: ActionReducer<AppState> = (
  state: AppState | undefined,
  _action: Action,
): AppState => (state === undefined ? initialAppState : state);

// Wrap with the meta-reducer under test
const wrapped: ActionReducer<AppState> = localStorageSyncReducer(baseReducer);

describe('localStorageSyncReducer', () => {
  let setItemSpy: jest.SpyInstance;

  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
    setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
  });

  it('persists configured slices to localStorage after any action', () => {
    const stateAfterInit = wrapped(undefined, { type: '@ngrx/store/init' });
    const stateAfterNoop = wrapped(stateAfterInit, { type: '[Test] Noop' });

    // It should write only configured keys
    const writtenKeys = setItemSpy.mock.calls.map(([k]) => k);
    expect(writtenKeys).toEqual(expect.arrayContaining([]));

    // And the stored values should match the latest state
    const storedCart = JSON.parse(
      localStorage.getItem('cart') ?? 'null',
    ) as CartState | null;
    const storedProducts = JSON.parse(
      localStorage.getItem('products') ?? 'null',
    ) as ProductsState | null;

    expect(storedCart).toEqual(stateAfterNoop.cart);
    expect(storedProducts).toEqual(stateAfterNoop.products);
  });

  it('falls back to initial slice values when storage JSON is corrupted', () => {
    localStorage.setItem('cart', '{bad json');
    localStorage.setItem('products', 'not json');

    const state = wrapped(undefined, { type: '@ngrx/store/init' });

    expect(state.cart).toEqual(initialCartState);
    expect(state.products).toEqual(initialProductsState);
  });
});
