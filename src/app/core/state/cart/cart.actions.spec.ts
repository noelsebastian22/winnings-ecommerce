import { CartActions } from './cart.actions';
import { Product } from '@infrastructure/models';

describe('CartActions', () => {
  const product: Product = {
    sku: 'sku-1',
    name: 'Test Product',
    price: 10,
    rrp: 12,
    image: 'http://example.com/img.jpg',
  };

  it('addToCart should create action with product payload', () => {
    const action = CartActions.addToCart({ product });
    expect(action.type).toBe('[Cart] Add To Cart');
    expect(action.product).toBe(product);
  });

  it('removeFromCart should create action with sku', () => {
    const sku = 'sku-1';
    const action = CartActions.removeFromCart({ productSku: sku });
    expect(action.type).toBe('[Cart] Remove From Cart');
    expect(action.productSku).toBe(sku);
  });

  it('updateQuantity should create action with sku and quantity', () => {
    const sku = 'sku-1';
    const quantity = 3;
    const action = CartActions.updateQuantity({ productSku: sku, quantity });
    expect(action.type).toBe('[Cart] Update Quantity');
    expect(action.productSku).toBe(sku);
    expect(action.quantity).toBe(quantity);
  });

  it('clearCart should create action without payload', () => {
    const action = CartActions.clearCart();
    expect(action.type).toBe('[Cart] Clear Cart');
  });
});
