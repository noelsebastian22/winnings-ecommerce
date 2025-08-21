import { CartItem, Product, ProductsResponse } from './product.model';

const createTestProduct = (overrides?: Partial<Product>): Product => ({
  sku: 'sku-123',
  name: 'Test Product',
  price: 100,
  rrp: 120,
  image: 'http://example.com/image.jpg',
  ...overrides,
});

describe('Product models', () => {
  it('should create a valid Product object', () => {
    const product = createTestProduct();

    expect(product.sku).toBe('sku-123');
    expect(product.price).toBe(100);
  });

  it('should create a valid ProductsResponse object', () => {
    const productsResponse: ProductsResponse = {
      products: [createTestProduct({ name: 'Special Product' })],
    };

    expect(productsResponse.products.length).toBe(1);
    expect(productsResponse.products[0].name).toBe('Special Product');
  });

  it('should create a valid CartItem object', () => {
    const product = createTestProduct();
    const cartItem: CartItem = {
      product,
      quantity: 2,
    };

    expect(cartItem.product.sku).toBe('sku-123');
    expect(cartItem.quantity).toBe(2);
  });
});
