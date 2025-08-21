import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddToCartModalComponent } from './add-to-cart-modal.component';
import { Product } from '@infrastructure/models';
import {
  configureComponentTestBed,
  DOMTestHelper,
  commonExpectations,
} from '@test-helpers';

describe('AddToCartModalComponent', () => {
  let component: AddToCartModalComponent;
  let fixture: ComponentFixture<AddToCartModalComponent>;
  let domHelper: DOMTestHelper;
  const product: Product = {
    sku: 'sku123',
    name: 'Test Product',
    price: 99,
    rrp: 120,
    image: 'test-product.jpg',
  };

  beforeEach(async () => {
    await configureComponentTestBed(
      AddToCartModalComponent,
    ).compileComponents();

    fixture = TestBed.createComponent(AddToCartModalComponent);
    component = fixture.componentInstance;
    domHelper = new DOMTestHelper(fixture);

    component.product = product;
    fixture.detectChanges();
  });

  it('should create', () => {
    commonExpectations.componentCreated(component);
  });

  it('should render product details', () => {
    expect(domHelper.getTextContent('.product-details h3')).toBe(product.name);
    expect(domHelper.getTextContent('.price')).toBe(`$${product.price}`);
    const image = domHelper.getElement<HTMLImageElement>('.product-image');
    expect(image?.src).toContain(product.image);
    expect(image?.alt).toBe(product.name);
  });

  it('should emit close event when overlay is clicked', () => {
    const closeSpy = jest.spyOn(component.closeModal, 'emit');
    domHelper.clickElement('.modal-overlay');
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should emit close event when view cart button is clicked', () => {
    const closeSpy = jest.spyOn(component.closeModal, 'emit');
    domHelper.clickElement('.view-cart-btn');
    expect(closeSpy).toHaveBeenCalled();
  });
});
