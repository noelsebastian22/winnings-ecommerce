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
// import { addToCart } from '../../../store/cart/cart.actions';
import { AddToCartModalComponent } from '../add-to-cart-modal/add-to-cart-modal.component';
import { Product } from '@infrastructure/models';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, AddToCartModalComponent],
  template: `
    <div class="product-card">
      <div class="product-image">
        <img [src]="product.image" [alt]="product.name" />
      </div>

      <div class="product-info">
        <h3 class="product-name">{{ product.name }}</h3>

        <div class="price-section">
          <div class="current-price">
            \${{ product.price | number: '1.0-0' }}
          </div>
          @if (discount() > 0) {
            <div class="original-price">
              \${{ product.rrp | number: '1.0-0' }}
            </div>
            <div class="discount">
              \${{ discount() }} off RRP of \${{
                product.rrp | number: '1.0-0'
              }}
            </div>
          }
        </div>

        <div class="action-buttons">
          <button class="add-to-cart-btn" (click)="handleAddToCart()">
            Add to Cart
          </button>
          <button class="compare-btn">Compare</button>
        </div>
      </div>
    </div>

    @if (showModal()) {
      <app-add-to-cart-modal [product]="product" (close)="closeModal()">
      </app-add-to-cart-modal>
    }
  `,
  styles: [
    `
      .product-card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .product-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      }

      .product-image {
        position: relative;
        height: 250px;
        overflow: hidden;
        background: #f8f9fa;
      }

      .product-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .product-info {
        padding: 1.5rem;
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .product-name {
        font-size: 1.1rem;
        font-weight: 500;
        color: #333;
        margin-bottom: 1rem;
        line-height: 1.4;
        flex: 1;
      }

      .price-section {
        margin-bottom: 1.5rem;
      }

      .current-price {
        font-size: 1.8rem;
        font-weight: bold;
        color: #28a745;
        margin-bottom: 0.25rem;
      }

      .original-price {
        font-size: 0.9rem;
        color: #999;
        text-decoration: line-through;
        margin-bottom: 0.25rem;
      }

      .discount {
        font-size: 0.9rem;
        color: #dc3545;
        font-weight: 500;
      }

      .action-buttons {
        display: flex;
        gap: 0.5rem;
        margin-top: auto;
      }

      .add-to-cart-btn {
        flex: 2;
        background: #28a745;
        color: white;
        border: none;
        padding: 0.75rem 1rem;
        border-radius: 4px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      .add-to-cart-btn:hover {
        background: #218838;
      }

      .compare-btn {
        flex: 1;
        background: transparent;
        color: #666;
        border: 1px solid #ddd;
        padding: 0.75rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .compare-btn:hover {
        background: #f8f9fa;
        border-color: #adb5bd;
      }
    `,
  ],
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();

  // Inject dependencies using the new inject() function
  private store = inject(Store<AppState>);

  // Use signals for reactive state
  showModal = signal(false);

  // Computed signal for discount calculation
  discount = computed(() => this.product.rrp - this.product.price);

  handleAddToCart() {
    // this.store.dispatch(addToCart({ product: this.product }));
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }
}
