import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

// Page titles are set per language by I18nService.
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'shop', loadComponent: () => import('./pages/shop/shop').then((m) => m.Shop) },
  { path: '**', redirectTo: '' },
];
