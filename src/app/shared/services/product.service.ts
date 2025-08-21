import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Product } from '@infrastructure/models/product.model';
import {
  ResourceService,
  RequestOptions,
} from '@infrastructure/http/resource.abstract';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends ResourceService<Product> {
  constructor() {
    // Use ResourceService with the path to the products JSON file
    super('products.json');
  }

  /**
   * Get all products
   */
  getProducts(options?: RequestOptions): Observable<Product[]> {
    return this.request<Product[]>('GET', this.url(), {
      ...options,
      body: undefined,
    }).pipe(
      delay(2000), // Add 2 second delay to test loading spinner and NgRx state
    );
  }
}
