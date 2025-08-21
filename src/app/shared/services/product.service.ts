import { Injectable, computed, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { Product } from '@infrastructure/models/product.model';
import { ResourceService, RequestOptions } from '@infrastructure/http/resource.abstract';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends ResourceService<Product> {
  private _productsSignal?: Signal<Product[]>;

  constructor() {
    // Use ResourceService with the path to the products JSON file
    super('products.json');
  }

  // Lazy initialize the products signal
  get products() {
    if (!this._productsSignal) {
      this._productsSignal = toSignal(this.getProducts(), {
        initialValue: [] as Product[],
      });
    }
    return this._productsSignal;
  }

  /**
   * Get all products
   */
  getProducts(options?: RequestOptions): Observable<Product[]> {
    return this.request<Product[]>('GET', this.url(), {
      ...options,
      body: undefined,
    });
  }

  /**
   * Get products by category (case-insensitive name includes)
   */
  getProductsByCategory(
    category: string,
    options?: RequestOptions,
  ): Observable<Product[]> {
    const term = category.toLowerCase();
    return this.getProducts(options).pipe(
      map((products) =>
        products.filter((product) => product.name.toLowerCase().includes(term)),
      ),
    );
  }

  /**
   * Search products by name
   */
  searchProducts(
    searchTerm: string,
    options?: RequestOptions,
  ): Observable<Product[]> {
    const term = searchTerm.toLowerCase();
    return this.getProducts(options).pipe(
      map((products) =>
        products.filter((product) => product.name.toLowerCase().includes(term)),
      ),
    );
  }

  /**
   * Get products with discount
   */
  getDiscountedProducts(options?: RequestOptions): Observable<Product[]> {
    return this.getProducts(options).pipe(
      map((products) =>
        products.filter((product) => product.rrp > product.price),
      ),
    );
  }

  /**
   * Get products within price range
   */
  getProductsByPriceRange(
    minPrice: number,
    maxPrice: number,
    options?: RequestOptions,
  ): Observable<Product[]> {
    return this.getProducts(options).pipe(
      map((products) =>
        products.filter(
          (product) => product.price >= minPrice && product.price <= maxPrice,
        ),
      ),
    );
  }

  /**
   * Create a computed signal for finding products by SKU
   */
  getProductBySku(sku: string) {
    return computed(() => {
      const products = this.products();
      return products.find((p) => p.sku === sku);
    });
  }

  /**
   * Get product by SKU (Observable version)
   */
  getProductBySkuObservable(
    sku: string,
    options?: RequestOptions,
  ): Observable<Product | undefined> {
    return this.getProducts(options).pipe(
      map((products) => products.find((p) => p.sku === sku)),
    );
  }

  /**
   * Get multiple products by SKUs
   */
  getProductsBySkus(
    skus: string[],
    options?: RequestOptions,
  ): Observable<Product[]> {
    return this.getProducts(options).pipe(
      map((products) =>
        products.filter((product) => skus.includes(product.sku)),
      ),
    );
  }

  /**
   * Get featured products (example: products with highest discount)
   */
  getFeaturedProducts(
    limit = 6,
    options?: RequestOptions,
  ): Observable<Product[]> {
    return this.getProducts(options).pipe(
      map((products) => {
        return products
          .filter((product) => product.rrp > product.price)
          .sort((a, b) => b.rrp - b.price - (a.rrp - a.price))
          .slice(0, limit);
      }),
    );
  }
}
