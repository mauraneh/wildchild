import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { CartService } from './core/cart.service';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the brand in the header', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.logo span')?.textContent).toContain('WILD CHILD');
  });
});

describe('CartService', () => {
  beforeEach(() => localStorage.clear());

  it('adds, merges and totals items', () => {
    const cart = TestBed.inject(CartService);
    cart.add('sore-sorry-tee', 'M');
    cart.add('sore-sorry-tee', 'M');
    cart.add('wild-child-cap', 'One size');
    expect(cart.count()).toBe(3);
    expect(cart.total()).toBe(32 * 2 + 28);
    cart.setQty(0, 0);
    expect(cart.count()).toBe(1);
  });

  it('stays in demo mode without a Shopify domain', () => {
    const cart = TestBed.inject(CartService);
    cart.add('sore-sorry-tee', 'M');
    expect(cart.checkoutUrl()).toBeNull();
  });
});
