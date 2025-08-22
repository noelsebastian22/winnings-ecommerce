import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '@infrastructure/models';

@Component({
  selector: 'app-add-to-cart-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-to-cart-modal.component.html',
  styleUrls: ['./add-to-cart-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddToCartModalComponent {
  @Input() product!: Product;
  @Output() closeModal = new EventEmitter<void>();

  onClose() {
    this.closeModal.emit();
  }

  onViewCart() {
    // TODO: Navigate to cart page when implemented
    this.closeModal.emit();
  }
}
