import { CartState } from '@core/state/cart/cart.reducer';
import { ProductsState } from '@core/state/products';

export const createMockProductsState = (
  overrides?: Partial<ProductsState>,
): ProductsState => ({
  loading: false,
  products: [],
  ...overrides,
});

export const createMockCartState = (
  overrides?: Partial<CartState>,
): CartState => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,
  ...overrides,
});

// HTTP Error test data factories
export const createMockHttpErrorResponse = (
  status = 500,
  statusText = 'Internal Server Error',
) => ({
  status,
  statusText,
  error: {
    message: `HTTP ${status} error occurred`,
    details: 'Test error details',
  },
  headers: new Map(),
  url: 'http://test-api.com/test-endpoint',
});

// Generic error factories
export const createMockError = (message = 'Test error'): Error => {
  return new Error(message);
};

export const createMockUnknownError = (): unknown => ({
  someProperty: 'unknown error object',
  nested: {
    error: 'nested error message',
  },
});

// Environment mock factory
export const createMockEnvironment = (overrides?: Record<string, unknown>) => ({
  production: false,
  apiUrl: 'http://localhost:3000/api',
  tmdbApiToken: 'test-tmdb-token',
  tmdbApiUrl: 'https://api.themoviedb.org/3',
  ...overrides,
});

// Form data factories for component testing
export const createMockFormData = (overrides?: Record<string, unknown>) => ({
  username: 'testuser',
  password: 'testpassword',
  ...overrides,
});

// Observable test data factories
export const createMockObservableData = <T>(data: T) => ({
  subscribe: (callback: (data: T) => void) => callback(data),
});

export const createMockObservableError = (error: Error) => ({
  subscribe: (callbacks: {
    next?: () => void;
    error?: (err: Error) => void;
  }) => {
    if (callbacks.error) {
      callbacks.error(error);
    }
  },
});
