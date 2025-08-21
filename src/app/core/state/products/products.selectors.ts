import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState } from './products.state';

export const selectProductsState =
  createFeatureSelector<ProductsState>('products');

// Only the selectors that are actually being used
export const selectAllProducts = createSelector(
  selectProductsState,
  (state) => state.products,
);

export const selectProductsLoading = createSelector(
  selectProductsState,
  (state) => state.loading,
);
