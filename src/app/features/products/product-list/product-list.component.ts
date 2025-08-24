import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsFacade } from '@core/state/products';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '@infrastructure/models';
import { CartFacade } from '@core/state/cart/cart.facade';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent implements OnInit {
  private productsFacade = inject(ProductsFacade);
  private cartFacade = inject(CartFacade);

  products$ = this.productsFacade.filteredProducts$;
  loading$ = this.productsFacade.loading$;

  ngOnInit() {
    this.productsFacade.loadProducts();
  }

  onAddToCart(product: Product) {
    this.cartFacade.addToCart(product);
  }
}
