import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  AfterViewInit,
  ElementRef,
  ViewChild,
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
export class AddToCartModalComponent implements AfterViewInit {
  @Input() product!: Product;
  @Output() closeModal = new EventEmitter<void>();

  @ViewChild('overlay') overlay!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    // Ensure the overlay receives focus so Escape key events are captured
    this.overlay.nativeElement.focus();
  }

  onClose() {
    this.closeModal.emit();
  }

  onViewCart() {
    // TODO: Navigate to cart page when implemented
    this.closeModal.emit();
  }
}
