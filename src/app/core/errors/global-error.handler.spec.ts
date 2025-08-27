import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandler } from './global-error.handler';
import { ErrorNotificationService } from '../services/error-notification.service';
import { environment } from '@environments/environment';
import { commonExpectations } from '@test-helpers/test-config';

jest.mock('@environments/environment', () => ({
  environment: {
    production: false,
    apiUrl: 'http://localhost:3000/api',
    tmdbApiToken: 'test-token',
  },
}));

describe('GlobalErrorHandler', () => {
  let service: GlobalErrorHandler;
  let errorNotificationService: jest.Mocked<ErrorNotificationService>;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    const errorNotificationServiceMock = {
      show: jest.fn(),
      toUserMessage: jest.fn(),
    } as jest.Mocked<ErrorNotificationService>;

    TestBed.configureTestingModule({
      providers: [
        GlobalErrorHandler,
        {
          provide: ErrorNotificationService,
          useValue: errorNotificationServiceMock,
        },
      ],
    });

    service = TestBed.inject(GlobalErrorHandler);
    errorNotificationService = TestBed.inject(
      ErrorNotificationService,
    ) as jest.Mocked<ErrorNotificationService>;

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Mock implementation
    });
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {
      // Mock implementation
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockReset();
    consoleWarnSpy.mockReset();
    environment.production = false;
  });

  it('should be created', () => {
    commonExpectations.serviceCreated(service);
  });

  describe('handleError', () => {
    describe('HttpErrorResponse handling', () => {
      it('should not call notification service for HttpErrorResponse to avoid double-reporting', () => {
        const httpError = new HttpErrorResponse({
          error: 'Server error',
          status: 500,
          statusText: 'Internal Server Error',
        });

        service.handleError(httpError);

        expect(errorNotificationService.show).not.toHaveBeenCalled();
      });

      it('should log HttpErrorResponse to console in development environment', () => {
        environment.production = false;
        const httpError = new HttpErrorResponse({
          error: 'Server error',
          status: 404,
          statusText: 'Not Found',
        });

        service.handleError(httpError);
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          '[HTTP caught in ErrorHandler]',
          httpError,
        );
      });

      it('should not log HttpErrorResponse to console in production environment', () => {
        environment.production = true;
        const httpError = new HttpErrorResponse({
          error: 'Server error',
          status: 500,
          statusText: 'Internal Server Error',
        });

        service.handleError(httpError);
        expect(consoleWarnSpy).not.toHaveBeenCalled();
      });
    });

    describe('Non-HTTP error handling', () => {
      it('should call notification service for regular Error objects', () => {
        const error = new Error('Something went wrong');

        service.handleError(error);
        expect(errorNotificationService.show).toHaveBeenCalledWith(error);
      });

      it('should call notification service for string errors', () => {
        const error = 'String error message';

        service.handleError(error);
        expect(errorNotificationService.show).toHaveBeenCalledWith(error);
      });

      it('should call notification service for null errors', () => {
        const error = null;

        service.handleError(error);
        expect(errorNotificationService.show).toHaveBeenCalledWith(error);
      });
    });

    describe('Development environment behavior', () => {
      beforeEach(() => {
        environment.production = false;
      });

      it('should log non-HTTP errors to console in development', () => {
        const error = new Error('Development error');

        service.handleError(error);
        expect(consoleErrorSpy).toHaveBeenCalledWith('[Uncaught error]', error);
      });
    });

    describe('Production environment behavior', () => {
      beforeEach(() => {
        environment.production = true;
      });

      it('should not log non-HTTP errors to console in production', () => {
        const error = new Error('Production error');

        service.handleError(error);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
      });

      it('should still call notification service in production', () => {
        const error = new Error('Production error');

        service.handleError(error);
        expect(errorNotificationService.show).toHaveBeenCalledWith(error);
      });
    });

    describe('isProd function error handling', () => {
      it('should handle environment access errors gracefully', () => {
        const originalProduction = environment.production;

        Object.defineProperty(environment, 'production', {
          get: () => {
            throw new Error('Environment access error');
          },
          configurable: true,
        });

        try {
          const error = new Error('Test error with broken environment');

          expect(() => {
            service.handleError(error);
          }).not.toThrow();
          expect(errorNotificationService.show).toHaveBeenCalledWith(error);
        } finally {
          Object.defineProperty(environment, 'production', {
            value: originalProduction,
            writable: true,
            configurable: true,
          });
        }
      });
    });
  });
});
