import { TestBed } from '@angular/core/testing';
import { MockStore } from '@ngrx/store/testing';
import { Product } from '@infrastructure/models';
import { ProductsFacade } from './products.facade';
import { ProductsActions } from './products.actions';
import { AppState } from '../../../store/app.state';
import { initialProductsState } from './products.state';
import { initialState as initialCartState } from '../cart/cart.reducer';
import { mockStoreProviders, StoreTestHelper } from '@test-helpers';

const createProduct = (overrides?: Partial<Product>): Product => ({
  sku: 'sku-1',
  name: 'Test Product',
  price: 10,
  rrp: 12,
  image: 'http://example.com/p.jpg',
  ...overrides,
});

describe('ProductsFacade', () => {
  let facade: ProductsFacade;
  let store: MockStore<AppState>;

  const baseState: AppState = {
    cart: initialCartState,
    products: initialProductsState,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductsFacade, ...mockStoreProviders(baseState)],
    });

    facade = TestBed.inject(ProductsFacade);
    store = TestBed.inject(MockStore);
    store.setState(baseState);
  });

  it('filteredProducts$ should emit products from store', (done) => {
    const products = [createProduct({ sku: 'A' })];
    store.setState({
      cart: initialCartState,
      products: { products, loading: false },
    });

    facade.filteredProducts$.subscribe((value) => {
      expect(value).toEqual(products);
      done();
    });
  });

  it('loading$ should emit loading flag from store', (done) => {
    store.setState({
      cart: initialCartState,
      products: { products: [], loading: true },
    });
    facade.loading$.subscribe((value) => {
      expect(value).toBe(true);
      done();
    });
  });

  it('loadProducts should dispatch loadProducts action', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    facade.loadProducts();
    StoreTestHelper.assertActionDispatched(
      dispatchSpy,
      ProductsActions.loadProducts() as {
        [key: string]: unknown;
        type: string;
      },
    );
  });
});
