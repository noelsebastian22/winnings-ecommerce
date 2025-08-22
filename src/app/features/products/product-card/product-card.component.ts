import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddToCartModalComponent } from '../add-to-cart-modal/add-to-cart-modal.component';
import { Product } from '@infrastructure/models';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, AddToCartModalComponent],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();

  showModal = signal(false);

  discount = computed(() => this.product.rrp - this.product.price);

  handleAddToCart(product: Product) {
    this.addToCart.emit(product);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }
}
