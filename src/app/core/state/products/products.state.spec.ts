import { initialProductsState, ProductsState } from './products.state';
import { ValidationHelper } from '@test-helpers';

describe('ProductsState', () => {
  it('should define the correct default values', () => {
    ValidationHelper.assertHasProperties<ProductsState>(initialProductsState, [
      'products',
      'loading',
    ]);
    expect(initialProductsState.products).toEqual([]);
    expect(initialProductsState.loading).toBe(false);
  });
});
