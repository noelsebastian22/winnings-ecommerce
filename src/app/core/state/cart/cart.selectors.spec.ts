import {
  selectCartState,
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalPrice,
  selectCartItemByProductSku,
} from './cart.selectors';
import { CartState, initialState as initialCartState } from './cart.reducer';
import { Product, CartItem } from '@infrastructure/models';

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

describe('Cart Selectors', () => {
  const pA = createProduct({ sku: 'A', price: 10 });
  const pB = createProduct({ sku: 'B', price: 20 });

  const items: CartItem[] = [createCartItem(pA, 2), createCartItem(pB, 1)];
  const populatedState: CartState = {
    items,
    totalItems: 3,
    totalPrice: 40,
  };

  it('selectCartState.projector returns the slice as-is', () => {
    expect(selectCartState.projector(populatedState)).toBe(populatedState);
  });

  it('selectCartItems.projector returns items[]', () => {
    expect(selectCartItems.projector(populatedState)).toBe(items);
    expect(selectCartItems.projector(initialCartState)).toEqual([]);
  });

  it('selectCartTotalItems.projector returns totalItems', () => {
    expect(selectCartTotalItems.projector(populatedState)).toBe(3);
    expect(selectCartTotalItems.projector(initialCartState)).toBe(0);
  });

  it('selectCartTotalPrice.projector returns totalPrice', () => {
    expect(selectCartTotalPrice.projector(populatedState)).toBe(40);
    expect(selectCartTotalPrice.projector(initialCartState)).toBe(0);
  });

  it('selectCartItemByProductSku(projector) finds item by sku', () => {
    const selectorA = selectCartItemByProductSku('A');
    const selectorX = selectCartItemByProductSku('X');

    expect(selectorA.projector(items)).toEqual(items[0]);
    expect(selectorX.projector(items)).toBeUndefined();
  });
});
