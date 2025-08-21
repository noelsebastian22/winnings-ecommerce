import { ProductsActions } from './products.actions';
import { Product } from '@infrastructure/models';

const createProduct = (overrides?: Partial<Product>): Product => ({
  sku: 'sku-1',
  name: 'Test Product',
  price: 10,
  rrp: 12,
  image: 'http://example.com/p.jpg',
  ...overrides,
});

describe('ProductsActions', () => {
  it('loadProducts should create action with correct type', () => {
    const action = ProductsActions.loadProducts();
    expect(action).toEqual({ type: '[Products] Load Products' });
  });

  it('loadProductsSuccess should create action with products payload', () => {
    const products = [createProduct({ sku: 'A' })];
    const action = ProductsActions.loadProductsSuccess({ products });
    expect(action).toEqual({
      type: '[Products] Load Products Success',
      products,
    });
  });
});
