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
    super('products.json');
  }

  /**
   * Get all products
   */
  getProducts(options?: RequestOptions): Observable<Product[]> {
    return this.list(options).pipe(delay(2000));
  }
}
