import { Action } from '@ngrx/store';
import { cartReducer, initialState, CartState } from './cart.reducer';
import { CartActions } from './cart.actions';
import { Product } from '@infrastructure/models';

const createProduct = (overrides?: Partial<Product>): Product => ({
  sku: 'sku-1',
  name: 'Test Product',
  price: 10,
  rrp: 12,
  image: 'http://example.com/p.jpg',
  ...overrides,
});

describe('cartReducer', () => {
  it('should return initial state on @ngrx/store/init', () => {
    const state = cartReducer(undefined, {
      type: '@ngrx/store/init',
    } as Action);
    expect(state).toEqual(initialState);
  });

  it('should return same state for unknown action', () => {
    const state = cartReducer(initialState, {
      type: '[Unknown] noop',
    } as Action);
    expect(state).toBe(initialState);
  });

  it('addToCart: adds a new product with quantity 1 and updates totals', () => {
    const p = createProduct({ sku: 'A', price: 10 });
    const next = cartReducer(
      initialState,
      CartActions.addToCart({ product: p }),
    );

    expect(next.items).toHaveLength(1);
    expect(next.items[0].product.sku).toBe('A');
    expect(next.items[0].quantity).toBe(1);
    expect(next.totalItems).toBe(1);
    expect(next.totalPrice).toBe(10);

    expect(next).not.toBe(initialState);
  });

  it('addToCart: increments quantity when product already exists', () => {
    const p = createProduct({ sku: 'A', price: 10 });
    const s1 = cartReducer(initialState, CartActions.addToCart({ product: p }));
    const s2 = cartReducer(s1, CartActions.addToCart({ product: p }));

    expect(s2.items).toHaveLength(1);
    expect(s2.items[0].quantity).toBe(2);
    expect(s2.totalItems).toBe(2);
    expect(s2.totalPrice).toBe(20);
  });

  it('removeFromCart: removes by sku and updates totals', () => {
    const pA = createProduct({ sku: 'A', price: 10 });
    const pB = createProduct({ sku: 'B', price: 20 });

    let state: CartState = initialState;
    state = cartReducer(state, CartActions.addToCart({ product: pA }));
    state = cartReducer(state, CartActions.addToCart({ product: pB }));

    const next = cartReducer(
      state,
      CartActions.removeFromCart({ productSku: 'A' }),
    );

    expect(next.items).toHaveLength(1);
    expect(next.items[0].product.sku).toBe('B');
    expect(next.totalItems).toBe(1);
    expect(next.totalPrice).toBe(20);
  });

  it('clearCart: resets to initialState', () => {
    const p = createProduct({ sku: 'A', price: 10 });
    const filled = cartReducer(
      initialState,
      CartActions.addToCart({ product: p }),
    );

    const cleared = cartReducer(filled, CartActions.clearCart());

    expect(cleared).toEqual(initialState);
  });
});
