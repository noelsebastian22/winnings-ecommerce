import { createReducer, on } from '@ngrx/store';
import { ProductsActions } from './products.actions';
import { initialProductsState } from './products.state';

export const productsReducer = createReducer(
  initialProductsState,

  on(ProductsActions.loadProducts, (state) => ({
    ...state,
    loading: true,
  })),

  on(ProductsActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    loading: false,
  })),
);
