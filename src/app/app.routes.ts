import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: Home, title: 'WILD CHILD — The Sunday Recovery Show' },
  { path: 'shop', loadComponent: () => import('./pages/shop/shop').then((m) => m.Shop), title: 'Shop — WILD CHILD' },
  { path: '**', redirectTo: '' },
];
