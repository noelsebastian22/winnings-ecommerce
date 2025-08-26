import { HttpHeaders, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';

const httpRequestMock = jest.fn();

jest.mock('@angular/core', () => {
  const actual = jest.requireActual('@angular/core');
  return {
    ...actual,
    inject: () =>
      ({
        request: httpRequestMock,
      }) as { request: (...args: unknown[]) => unknown },
  };
});

jest.mock('@environments/environment', () => ({
  environment: { apiUrl: 'https://api.example.com/' },
}));

import { ProductService } from './product.service';
import { Product } from '@infrastructure/models/product.model';

describe('ProductService', () => {
  beforeEach(() => {
    httpRequestMock.mockReset();
  });

  it('getProducts calls GET on {baseUrl}/products.json with no body', () => {
    httpRequestMock.mockReturnValue(of<Product[]>([]));
    const svc = new ProductService();

    svc.getProducts().subscribe();

    const [method, url, options] = httpRequestMock.mock.calls[0] as [
      string,
      string,
      { body?: unknown },
    ];

    expect(method).toBe('GET');
    expect(url).toBe('https://api.example.com/products.json');
    expect(options.body).toBeUndefined();
  });

  it('passes through provided params and headers', () => {
    httpRequestMock.mockReturnValue(of<Product[]>([]));
    const svc = new ProductService();

    const params = new HttpParams().set('q', 'laptop');
    const headers = new HttpHeaders({ 'X-Trace': 'abc' });

    svc.getProducts({ params, headers }).subscribe();

    const options = httpRequestMock.mock.calls[0][2] as {
      params?: HttpParams;
      headers?: HttpHeaders;
    };
    expect(options.params).toBe(params);
    expect(options.headers?.get('X-Trace')).toBe('abc');
  });

  it('delays emission by 2000ms', () => {
    jest.useFakeTimers();
    const items: Product[] = [
      { sku: 'p1', name: 'P1', price: 1, rrp: 1, image: '' },
    ];
    httpRequestMock.mockReturnValue(of(items));
    const svc = new ProductService();

    const received: Product[][] = [];
    let completed = false;

    svc.getProducts().subscribe({
      next: (v) => received.push(v),
      complete: () => {
        completed = true;
      },
    });

    expect(received.length).toBe(0);
    expect(completed).toBe(false);

    jest.advanceTimersByTime(1999);
    expect(received.length).toBe(0);
    expect(completed).toBe(false);

    jest.advanceTimersByTime(1);
    expect(received).toEqual([items]);
    expect(completed).toBe(true);

    jest.useRealTimers();
  });
});
