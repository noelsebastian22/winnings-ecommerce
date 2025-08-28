import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  isDevMode,
  ErrorHandler,
  provideZonelessChangeDetection,
  provideCheckNoChangesConfig,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { reducers } from './store';
import { metaReducers } from './store';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor, loadingInterceptor } from '@core/http/interceptors';
import { GlobalErrorHandler } from '@core/errors/global-error.handler';
import { ProductsEffects } from '@core/state/products';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideCheckNoChangesConfig({ exhaustive: true, interval: 1000 }),
    provideHttpClient(withInterceptors([loadingInterceptor, errorInterceptor])),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideRouter(routes),
    provideStore(reducers, { metaReducers }),
    provideEffects([ProductsEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
