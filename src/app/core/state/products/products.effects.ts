import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { ProductService } from '../../../shared/services/product.service';
import { ProductsActions } from './products.actions';
import { Product } from '@infrastructure/models';

@Injectable()
export class ProductsEffects {
  private readonly actions$ = inject(Actions);
  private readonly productService = inject(ProductService);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProducts),
      switchMap(() =>
        this.productService
          .getProducts()
          .pipe(
            map((products: Product[]) =>
              ProductsActions.loadProductsSuccess({ products }),
            ),
          ),
      ),
    ),
  );
}
