import { Action } from '@ngrx/store';
import { productsReducer } from './products.reducer';
import { ProductsActions } from './products.actions';
import { initialProductsState } from './products.state';
import { Product } from '@infrastructure/models';
import { StoreTestHelper } from '@test-helpers';

const createProduct = (overrides?: Partial<Product>): Product => ({
  sku: 'sku-1',
  name: 'Test Product',
  price: 10,
  rrp: 12,
  image: 'http://example.com/p.jpg',
  ...overrides,
});

describe('productsReducer', () => {
  it('should return initial state on @ngrx/store/init', () => {
    const state = productsReducer(undefined, {
      type: '@ngrx/store/init',
    } as Action);
    expect(state).toEqual(initialProductsState);
  });

  it('should set loading true on loadProducts', () => {
    const state = productsReducer(
      initialProductsState,
      ProductsActions.loadProducts(),
    );
    expect(state).toEqual({ products: [], loading: true });
  });

  it('should populate products and set loading false on loadProductsSuccess', () => {
    const products = [createProduct({ sku: 'A' })];
    const state = productsReducer(
      { ...initialProductsState, loading: true },
      ProductsActions.loadProductsSuccess({ products }),
    );
    expect(state).toEqual({ products, loading: false });
  });

  it('should return same state for unknown action', () => {
    const unknown = StoreTestHelper.createMockAction('[Unknown]');
    const state = productsReducer(initialProductsState, unknown as Action);
    expect(state).toBe(initialProductsState);
  });
});
