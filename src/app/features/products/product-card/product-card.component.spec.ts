import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { Product } from '@infrastructure/models';
import {
  configureComponentTestBed,
  DOMTestHelper,
  commonExpectations,
  mockStoreProviders,
} from '@test-helpers';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let domHelper: DOMTestHelper;

  const product: Product = {
    sku: 'sku123',
    name: 'Test Product',
    price: 99,
    rrp: 120,
    image: 'test-product.jpg',
  };

  beforeEach(async () => {
    await configureComponentTestBed(ProductCardComponent, {
      providers: [...mockStoreProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    domHelper = new DOMTestHelper(fixture);

    component.product = product;
    fixture.detectChanges();
  });

  it('should create', () => {
    commonExpectations.componentCreated(component);
  });

  it('should display product information including discount', () => {
    expect(domHelper.getTextContent('.product-name')).toBe(product.name);
    expect(domHelper.getTextContent('.current-price')).toBe(
      `$${product.price}`,
    );
    expect(domHelper.getTextContent('.original-price')).toBe(`$${product.rrp}`);
    expect(domHelper.getTextContent('.discount')).toContain(
      `${product.rrp - product.price}`,
    );
  });

  it('should emit addToCart event and show modal when add to cart clicked', () => {
    const addSpy = jest.spyOn(component.addToCart, 'emit');
    domHelper.clickElement('.add-to-cart-btn');
    expect(addSpy).toHaveBeenCalledWith(product);
    expect(component.showModal()).toBe(true);
    expect(domHelper.elementExists('app-add-to-cart-modal')).toBe(true);
  });
});
