const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {
  // Mock implementation
});

const mockBootstrapApplication = jest.fn();

jest.mock('@angular/platform-browser', () => ({
  bootstrapApplication: mockBootstrapApplication,
}));

describe('main.ts', () => {
  beforeEach(() => {
    mockBootstrapApplication.mockClear();
    mockConsoleError.mockClear();
    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  describe('Application Bootstrap', () => {
    it('should call bootstrapApplication with correct component and configuration', async () => {
      const mockPromise = Promise.resolve();
      mockBootstrapApplication.mockReturnValue(mockPromise);

      await import('./main');

      expect(mockBootstrapApplication).toHaveBeenCalledTimes(1);
    });

    it('should pass the App component as the first parameter', async () => {
      const mockPromise = Promise.resolve();
      mockBootstrapApplication.mockReturnValue(mockPromise);

      await import('./main');

      expect(mockBootstrapApplication).toHaveBeenCalled();
      const [component] = mockBootstrapApplication.mock.calls[0];
      expect(component).toBeDefined();
      expect(typeof component).toBe('function');
    });

    it('should pass the appConfig as the second parameter', async () => {
      const mockPromise = Promise.resolve();
      mockBootstrapApplication.mockReturnValue(mockPromise);

      await import('./main');

      expect(mockBootstrapApplication).toHaveBeenCalled();
      const [, config] = mockBootstrapApplication.mock.calls[0];
      expect(config).toBeDefined();
      expect(config).toHaveProperty('providers');
    });
  });

  describe('Configuration Verification', () => {
    let appConfig: { providers: unknown[] };

    beforeEach(async () => {
      const configModule = await import('./app/app.config');
      appConfig = configModule.appConfig;
    });

    it('should verify appConfig contains required providers', () => {
      expect(appConfig.providers).toBeDefined();
      expect(Array.isArray(appConfig.providers)).toBe(true);
      expect(appConfig.providers.length).toBeGreaterThan(0);
    });

    it('should have exactly 8 providers configured', () => {
      expect(appConfig.providers.length).toBe(8);
    });

    it('should have all providers defined and not null', () => {
      appConfig.providers.forEach((provider: unknown) => {
        expect(provider).toBeDefined();
        expect(provider).not.toBeNull();
      });
    });

    it('should include object-based providers', () => {
      const hasObjectProviders = appConfig.providers.some(
        (provider: unknown) =>
          typeof provider === 'object' && provider !== null,
      );
      expect(hasObjectProviders).toBe(true);
    });

    it('should include custom error handler provider', () => {
      const hasErrorHandlerProvider = appConfig.providers.some(
        (provider: unknown) =>
          typeof provider === 'object' &&
          provider !== null &&
          'provide' in provider &&
          'useClass' in provider,
      );
      expect(hasErrorHandlerProvider).toBe(true);
    });

    it('should have providers with correct structure', () => {
      appConfig.providers.forEach((provider: unknown, _index: number) => {
        expect(['function', 'object'].includes(typeof provider)).toBe(true);
        if (typeof provider === 'object') {
          expect(provider).not.toBeNull();
        }
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle bootstrap errors and log them to console', async () => {
      const testError = new Error('Bootstrap failed');
      const mockPromise = Promise.reject(testError);
      mockBootstrapApplication.mockReturnValue(mockPromise);

      await import('./main');

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockConsoleError).toHaveBeenCalledTimes(1);
      expect(mockConsoleError).toHaveBeenCalledWith(testError);
    });

    it('should handle network-related bootstrap errors', async () => {
      const networkError = new Error('Network error during bootstrap');
      const mockPromise = Promise.reject(networkError);
      mockBootstrapApplication.mockReturnValue(mockPromise);

      await import('./main');

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockConsoleError).toHaveBeenCalledWith(networkError);
    });

    it('should handle configuration-related bootstrap errors', async () => {
      const configError = new Error('Invalid configuration');
      const mockPromise = Promise.reject(configError);
      mockBootstrapApplication.mockReturnValue(mockPromise);

      await import('./main');

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockConsoleError).toHaveBeenCalledWith(configError);
    });

    it('should handle dependency injection errors during bootstrap', async () => {
      const diError = new Error('Dependency injection failed');
      const mockPromise = Promise.reject(diError);
      mockBootstrapApplication.mockReturnValue(mockPromise);

      await import('./main');

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockConsoleError).toHaveBeenCalledWith(diError);
    });
  });

  describe('Dependency Injection Setup', () => {
    let appConfig: { providers: unknown[] };

    beforeEach(async () => {
      const configModule = await import('./app/app.config');
      appConfig = configModule.appConfig;
    });

    it('should verify provider configuration structure', () => {
      expect(appConfig).toHaveProperty('providers');
      expect(appConfig.providers).toBeInstanceOf(Array);
    });

    it('should have all providers properly configured', () => {
      appConfig.providers.forEach((provider: unknown) => {
        expect(provider).toBeDefined();
        expect(provider).not.toBeNull();
      });
      expect(appConfig.providers.length).toBe(8);
    });

    it('should have providers that are not null or undefined', () => {
      appConfig.providers.forEach((provider: unknown) => {
        expect(provider).toBeDefined();
        expect(provider).not.toBeNull();
      });
    });

    it('should include error handler configuration', () => {
      const errorHandlerProvider = appConfig.providers.find(
        (provider: unknown) =>
          typeof provider === 'object' &&
          provider !== null &&
          'provide' in provider &&
          'useClass' in provider,
      );
      expect(errorHandlerProvider).toBeDefined();
      expect(errorHandlerProvider?.provide).toBeDefined();
      expect(errorHandlerProvider?.useClass).toBeDefined();
    });
  });

  describe('Application Initialization', () => {
    it('should successfully initialize when all dependencies are available', async () => {
      const mockApplicationRef = {
        bootstrap: jest.fn(),
        tick: jest.fn(),
        destroy: jest.fn(),
      };
      const mockPromise = Promise.resolve(mockApplicationRef);
      mockBootstrapApplication.mockReturnValue(mockPromise);

      await import('./main');
      const result = await mockPromise;

      expect(result).toBe(mockApplicationRef);
      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    it('should handle successful bootstrap without errors', async () => {
      const mockPromise = Promise.resolve({});
      mockBootstrapApplication.mockReturnValue(mockPromise);

      await import('./main');
      await mockPromise;

      expect(mockBootstrapApplication).toHaveBeenCalled();
      expect(mockConsoleError).not.toHaveBeenCalled();
    });
  });

  describe('Module Loading', () => {
    it('should import required modules without errors', async () => {
      const appModule = await import('./app/app');
      const configModule = await import('./app/app.config');

      expect(appModule.App).toBeDefined();
      expect(configModule.appConfig).toBeDefined();
    });

    it('should have valid App component reference', async () => {
      const appModule = await import('./app/app');

      expect(appModule.App).toBeDefined();
      expect(typeof appModule.App).toBe('function');
    });

    it('should have valid appConfig reference', async () => {
      const configModule = await import('./app/app.config');

      expect(configModule.appConfig).toBeDefined();
      expect(typeof configModule.appConfig).toBe('object');
      expect(configModule.appConfig.providers).toBeDefined();
    });
  });

  describe('Bootstrap Process Integration', () => {
    it('should call bootstrapApplication with App component and appConfig', async () => {
      const mockPromise = Promise.resolve();
      mockBootstrapApplication.mockReturnValue(mockPromise);

      await import('./main');

      expect(mockBootstrapApplication).toHaveBeenCalledTimes(1);
      const [component, config] = mockBootstrapApplication.mock.calls[0];

      expect(component).toBeDefined();
      expect(typeof component).toBe('function');

      expect(config).toBeDefined();
      expect(config).toHaveProperty('providers');
      expect(Array.isArray(config.providers)).toBe(true);
    });

    it('should handle the bootstrap promise chain correctly', async () => {
      const mockApplicationRef = { destroy: jest.fn() };
      const mockPromise = Promise.resolve(mockApplicationRef);
      mockBootstrapApplication.mockReturnValue(mockPromise);

      await import('./main');

      await mockPromise;

      expect(mockBootstrapApplication).toHaveBeenCalled();
      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    it('should properly handle async bootstrap errors with catch block', async () => {
      const bootstrapError = new Error('Async bootstrap failure');
      const mockPromise = Promise.reject(bootstrapError);
      mockBootstrapApplication.mockReturnValue(mockPromise);

      await import('./main');

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockBootstrapApplication).toHaveBeenCalled();
      expect(mockConsoleError).toHaveBeenCalledWith(bootstrapError);
    });
  });

  describe('Provider Configuration Details', () => {
    let appConfig: { providers: unknown[] };

    beforeEach(async () => {
      const configModule = await import('./app/app.config');
      appConfig = configModule.appConfig;
    });

    it('should verify all providers are properly configured', () => {
      expect(appConfig.providers).toHaveLength(8);

      appConfig.providers.forEach((provider: unknown) => {
        expect(provider).toBeDefined();
        expect(provider).not.toBeNull();
      });
    });

    it('should have providers that support Angular dependency injection', () => {
      appConfig.providers.forEach((provider: unknown, _index: number) => {
        expect(provider).toBeDefined();
        expect(provider).not.toBeNull();

        expect(['function', 'object'].includes(typeof provider)).toBe(true);
      });
    });

    it('should include the expected number of providers from app.config.ts', () => {
      expect(appConfig.providers).toHaveLength(8);
    });

    it('should have at least one provider with provide/useClass structure', () => {
      const classBasedProvider = appConfig.providers.find(
        (provider: unknown) =>
          typeof provider === 'object' &&
          provider !== null &&
          'provide' in provider &&
          'useClass' in provider,
      );
      expect(classBasedProvider).toBeDefined();
    });
  });
});
