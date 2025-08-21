import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { HeaderComponent } from './header.component';
import { initialState as initialCartState } from '@core/state/cart/cart.reducer';
import { initialProductsState } from '@core/state/products';

describe('HeaderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideMockStore({
          initialState: {
            cart: { ...initialCartState, totalItems: 3 },
            products: initialProductsState,
          },
        }),
        provideRouter([]),
      ],
    }).compileComponents();
  });

  it('exposes cartItemCount as a signal with current total', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.cartItemCount()).toBe(3);
  });
});
