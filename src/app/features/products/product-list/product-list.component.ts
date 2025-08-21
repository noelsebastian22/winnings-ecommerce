import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../shared/services/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '@infrastructure/models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  // Inject dependencies using the new inject() function
  private productService = inject(ProductService);

  // Initialize products signal
  products = this.productService.products;

  onAddToCart(product: Product) {
    // This will be handled by the product card component
    // which will dispatch the action and show the modal
  }
}