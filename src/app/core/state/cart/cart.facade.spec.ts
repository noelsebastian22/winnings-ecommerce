import { TestBed } from '@angular/core/testing';
import { MockStore } from '@ngrx/store/testing';
import { CartFacade } from './cart.facade';
import { CartActions } from './cart.actions';
import { AppState } from '../../../store/app.state';
import { CartItem, Product } from '@infrastructure/models';
import { initialState as initialCartState } from './cart.reducer';
import { initialProductsState } from '../products/products.state';
import { mockStoreProviders, StoreTestHelper } from '@test-helpers';

const createProduct = (overrides?: Partial<Product>): Product => ({
  sku: 'sku-1',
  name: 'Test Product',
  price: 10,
  rrp: 12,
  image: 'http://example.com/p.jpg',
  ...overrides,
});

const createCartItem = (product: Product, quantity = 1): CartItem => ({
  product,
  quantity,
});

describe('CartFacade', () => {
  let facade: CartFacade;
  let store: MockStore<AppState>;

  const baseState: AppState = {
    cart: initialCartState,
    products: initialProductsState,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartFacade, ...mockStoreProviders(baseState)],
    });

    facade = TestBed.inject(CartFacade);
    store = TestBed.inject(MockStore);
    store.setState(baseState);
  });

  it('items$ should emit cart items from store', (done) => {
    const cartItems = [createCartItem(createProduct({ sku: 'A' }), 2)];
    store.setState({
      cart: { items: cartItems, totalItems: 2, totalPrice: 20 },
      products: initialProductsState,
    });

    facade.items$.subscribe((value) => {
      expect(value).toEqual(cartItems);
      done();
    });
  });

  it('totalItems$ should emit total items from store', (done) => {
    store.setState({
      cart: { items: [], totalItems: 5, totalPrice: 0 },
      products: initialProductsState,
    });

    facade.totalItems$.subscribe((value) => {
      expect(value).toBe(5);
      done();
    });
  });

  it('totalPrice$ should emit total price from store', (done) => {
    store.setState({
      cart: { items: [], totalItems: 0, totalPrice: 100 },
      products: initialProductsState,
    });

    facade.totalPrice$.subscribe((value) => {
      expect(value).toBe(100);
      done();
    });
  });

  it('addToCart should dispatch addToCart action', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const product = createProduct({ sku: 'X' });
    facade.addToCart(product);
    StoreTestHelper.assertActionDispatched(
      dispatchSpy,
      CartActions.addToCart({ product }) as unknown as {
        type: string;
        [key: string]: unknown;
      },
    );
  });

  it('removeFromCart should dispatch removeFromCart action', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    facade.removeFromCart('sku-1');
    StoreTestHelper.assertActionDispatched(
      dispatchSpy,
      CartActions.removeFromCart({ productSku: 'sku-1' }) as unknown as {
        type: string;
        [key: string]: unknown;
      },
    );
  });

  it('updateQuantity should dispatch updateQuantity action', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    facade.updateQuantity('sku-1', 3);
    StoreTestHelper.assertActionDispatched(
      dispatchSpy,
      CartActions.updateQuantity({
        productSku: 'sku-1',
        quantity: 3,
      }) as unknown as {
        type: string;
        [key: string]: unknown;
      },
    );
  });

  it('clearCart should dispatch clearCart action', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    facade.clearCart();
    StoreTestHelper.assertActionDispatched(
      dispatchSpy,
      CartActions.clearCart() as { type: string; [key: string]: unknown },
    );
  });
});
