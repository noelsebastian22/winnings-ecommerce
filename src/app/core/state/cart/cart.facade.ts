import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CartItem, Product } from '@infrastructure/models';
import { AppState } from '../../../store/app.state';
import { CartActions } from './cart.actions';
import {
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalPrice,
} from './cart.selectors';

@Injectable({
  providedIn: 'root',
})
export class CartFacade {
  readonly items$: Observable<CartItem[]>;
  readonly totalItems$: Observable<number>;
  readonly totalPrice$: Observable<number>;

  private readonly store = inject(Store<AppState>);

  constructor() {
    this.items$ = this.store.select(selectCartItems);
    this.totalItems$ = this.store.select(selectCartTotalItems);
    this.totalPrice$ = this.store.select(selectCartTotalPrice);
  }

  addToCart(product: Product): void {
    this.store.dispatch(CartActions.addToCart({ product }));
  }

  removeFromCart(productSku: string): void {
    this.store.dispatch(CartActions.removeFromCart({ productSku }));
  }

  updateQuantity(productSku: string, quantity: number): void {
    this.store.dispatch(CartActions.updateQuantity({ productSku, quantity }));
  }

  clearCart(): void {
    this.store.dispatch(CartActions.clearCart());
  }
}
