import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Subject, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { ProductsEffects } from './products.effects';
import { ProductsActions } from './products.actions';
import { Product } from '@infrastructure/models';
import { ProductService } from '../../../shared/services/product.service';
import { configureServiceTestBed } from '@test-helpers';

const createProduct = (overrides?: Partial<Product>): Product => ({
  sku: 'sku-1',
  name: 'Test Product',
  price: 10,
  rrp: 12,
  image: 'http://example.com/p.jpg',
  ...overrides,
});

describe('ProductsEffects', () => {
  let actions$: Subject<Action>;
  let effects: ProductsEffects;
  let productService: { getProducts: jest.Mock };

  beforeEach(() => {
    actions$ = new Subject<Action>();
    productService = { getProducts: jest.fn() };

    configureServiceTestBed({
      providers: [
        ProductsEffects,
        provideMockActions(() => actions$),
        { provide: ProductService, useValue: productService },
      ],
    });

    effects = TestBed.inject(ProductsEffects);
  });

  it('should dispatch loadProductsSuccess with products', (done) => {
    const products = [createProduct({ sku: 'A' })];
    productService.getProducts.mockReturnValue(of(products));

    effects.loadProducts$.subscribe((action) => {
      expect(action).toEqual(ProductsActions.loadProductsSuccess({ products }));
      expect(productService.getProducts).toHaveBeenCalledTimes(1);
      done();
    });

    actions$.next(ProductsActions.loadProducts());
  });
});
