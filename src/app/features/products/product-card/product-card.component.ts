import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { AddToCartModalComponent } from '../add-to-cart-modal/add-to-cart-modal.component';
import { Product } from '@infrastructure/models';
import { addToCart } from '@core/state/cart/cart.actions';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, AddToCartModalComponent],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();

  private store = inject(Store<AppState>);

  showModal = signal(false);

  discount = computed(() => this.product.rrp - this.product.price);

  handleAddToCart() {
    this.store.dispatch(addToCart({ product: this.product }));
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }
}
