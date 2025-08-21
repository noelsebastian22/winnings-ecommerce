import {
  selectProductsState,
  selectAllProducts,
  selectProductsLoading,
} from './products.selectors';
import { ProductsState, initialProductsState } from './products.state';
import { Product } from '@infrastructure/models';
import { ValidationHelper } from '@test-helpers';

const createProduct = (overrides?: Partial<Product>): Product => ({
  sku: 'sku-1',
  name: 'Test Product',
  price: 10,
  rrp: 12,
  image: 'http://example.com/p.jpg',
  ...overrides,
});

describe('Products Selectors', () => {
  const pA = createProduct({ sku: 'A' });
  const pB = createProduct({ sku: 'B' });
  const populatedState: ProductsState = { products: [pA, pB], loading: true };

  it('selectProductsState.projector returns the state slice', () => {
    expect(selectProductsState.projector(populatedState)).toBe(populatedState);
  });

  it('selectAllProducts.projector returns products array', () => {
    const result = selectAllProducts.projector(populatedState);
    expect(result).toBe(populatedState.products);
    const empty = selectAllProducts.projector(initialProductsState);
    expect(empty).toEqual([]);
    ValidationHelper.assertArrayContainsObjectsWithProperties<Product>(result, [
      'sku',
      'name',
      'price',
      'rrp',
      'image',
    ]);
  });

  it('selectProductsLoading.projector returns loading flag', () => {
    expect(selectProductsLoading.projector(populatedState)).toBe(true);
    expect(selectProductsLoading.projector(initialProductsState)).toBe(false);
  });
});
