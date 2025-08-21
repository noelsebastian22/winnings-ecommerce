import { routes } from './app.routes';

describe('App Routes', () => {
  it('should have a redirect from "" to /home', () => {
    const redirect = routes.find((r) => r.path === '');
    expect(redirect).toBeDefined();
    expect(redirect?.redirectTo).toBe('/home');
    expect(redirect?.pathMatch).toBe('full');
  });

  it('should define home route with a loadComponent', async () => {
    const homeRoute = routes.find((r) => r.path === 'home');
    expect(homeRoute).toBeDefined();
    expect(typeof homeRoute?.loadComponent).toBe('function');

    const comp = await homeRoute!.loadComponent!();
    expect(comp).toBeDefined();
  });

  it('should define products route with a loadComponent', async () => {
    const productsRoute = routes.find((r) => r.path === 'products');
    expect(productsRoute).toBeDefined();
    expect(typeof productsRoute?.loadComponent).toBe('function');

    const comp = await productsRoute!.loadComponent!();
    expect(comp).toBeDefined();
  });
});
