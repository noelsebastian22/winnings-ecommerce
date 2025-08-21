import { Product } from '@infrastructure/models';

export interface ProductsState {
  products: Product[];
  loading: boolean;
}

export const initialProductsState: ProductsState = {
  products: [],
  loading: false,
};
