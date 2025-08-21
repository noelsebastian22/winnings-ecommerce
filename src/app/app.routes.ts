import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  // {
  //   path: 'products',
  //   loadComponent: () =>
  //     import('./features/products/product-list/product-list.component').then(
  //       (m) => m.ProductListComponent,
  //     ),
  // },
];
