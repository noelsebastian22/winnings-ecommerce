import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import {
  configureComponentTestBed,
  DOMTestHelper,
  commonExpectations,
  mockStoreProviders,
} from '@test-helpers';
import { ProductsFacade } from '@core/state/products';
import { Product } from '@infrastructure/models';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { addToCart } from '@core/state/cart/cart.actions';

jest.mock('@core/state/products', () => ({
  ProductsFacade: jest.fn(),
}));

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let domHelper: DOMTestHelper;
  let store: Store;

  const products: Product[] = [
    { sku: 'sku1', name: 'Product 1', price: 100, rrp: 150, image: 'img1.jpg' },
    { sku: 'sku2', name: 'Product 2', price: 200, rrp: 250, image: 'img2.jpg' },
  ];

  const mockFacade = {
    filteredProducts$: of(products),
    loading$: of(false),
    loadProducts: jest.fn(),
  };

  beforeEach(async () => {
    await configureComponentTestBed(ProductListComponent, {
      providers: [
        { provide: ProductsFacade, useValue: mockFacade },
        ...mockStoreProviders(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    domHelper = new DOMTestHelper(fixture);
    fixture.detectChanges();
  });

  it('should create and load products on init', () => {
    commonExpectations.componentCreated(component);
    expect(mockFacade.loadProducts).toHaveBeenCalled();
  });

  it('should render page header', () => {
    expect(domHelper.getTextContent('h1')).toBe('Our Products');
  });

  it('should dispatch addToCart when onAddToCart is called', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const product = products[0];
    component.onAddToCart(product);
    expect(dispatchSpy).toHaveBeenCalledWith(addToCart({ product }));
  });
});
