import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '@infrastructure/models';
import { AppState } from '../../../store/app.state';
import { ProductsActions } from './products.actions';
import { selectAllProducts, selectProductsLoading } from './products.selectors';

@Injectable({
  providedIn: 'root',
})
export class ProductsFacade {
  readonly filteredProducts$: Observable<Product[]>;
  readonly loading$: Observable<boolean>;

  private readonly store = inject(Store<AppState>);
  constructor() {
    this.filteredProducts$ = this.store.select(selectAllProducts);
    this.loading$ = this.store.select(selectProductsLoading);
  }

  loadProducts(): void {
    this.store.dispatch(ProductsActions.loadProducts());
  }
}
