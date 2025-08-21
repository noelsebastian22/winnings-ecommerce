import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  const navigateMock = jest
    .fn<Promise<boolean>, [unknown[], unknown?]>()
    .mockResolvedValue(true);

  const routerMock: { navigate: typeof navigateMock } = {
    navigate: navigateMock,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [{ provide: Router, useValue: routerMock }],
    }).compileComponents();

    navigateMock.mockClear();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should be a standalone component', () => {
    expect(
      (HomeComponent as unknown as { ɵcmp: { standalone: boolean } }).ɵcmp
        .standalone,
    ).toBe(true);
  });

  it('navigateToProducts should call router.navigate(["/products"])', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const comp = fixture.componentInstance;

    comp.navigateToProducts();

    expect(navigateMock).toHaveBeenCalledWith(['/products']);
  });
});
