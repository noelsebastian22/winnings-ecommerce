import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsFacade } from '@core/state/products';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '@infrastructure/models';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store';
import { addToCart } from '@core/state/cart/cart.actions';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  private productsFacade = inject(ProductsFacade);
  private store = inject(Store<AppState>);

  // Use observables from the facade
  products$ = this.productsFacade.filteredProducts$;
  loading$ = this.productsFacade.loading$;

  ngOnInit() {
    this.productsFacade.loadProducts();
  }

  onAddToCart(product: Product) {
    this.store.dispatch(addToCart({ product: product }));
  }
}
