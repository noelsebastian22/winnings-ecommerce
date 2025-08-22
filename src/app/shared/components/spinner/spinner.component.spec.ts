import { TestBed } from '@angular/core/testing';
import { signal, Signal } from '@angular/core';
import { SpinnerComponent } from './spinner.component';
import { LoadingService } from '@core/services/loading.service';

class MockLoadingService {
  private _isLoading = signal<boolean>(false);
  readonly isLoading: Signal<boolean> = this._isLoading.asReadonly();
  setLoading(v: boolean) {
    this._isLoading.set(v);
  }
}

describe('SpinnerComponent', () => {
  let mockLoading: MockLoadingService;

  beforeEach(async () => {
    mockLoading = new MockLoadingService();

    await TestBed.configureTestingModule({
      imports: [SpinnerComponent], // standalone component
      providers: [{ provide: LoadingService, useValue: mockLoading }],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SpinnerComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('does not render overlay when not loading', () => {
    const fixture = TestBed.createComponent(SpinnerComponent);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const overlay = el.querySelector('[data-testid="global-spinner"]');
    expect(overlay).toBeNull();
  });

  it('renders overlay with spinner and a11y attributes when loading', () => {
    const fixture = TestBed.createComponent(SpinnerComponent);

    // turn loading ON
    mockLoading.setLoading(true);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const overlay = el.querySelector(
      '[data-testid="global-spinner"]',
    ) as HTMLElement | null;
    expect(overlay).not.toBeNull();

    // a11y attributes
    expect(overlay!.getAttribute('role')).toBe('status');
    expect(overlay!.getAttribute('aria-live')).toBe('polite');

    // spinner element exists
    const spinner = el.querySelector('.spinner');
    expect(spinner).not.toBeNull();
  });

  it('hides overlay again when loading turns off', () => {
    const fixture = TestBed.createComponent(SpinnerComponent);

    mockLoading.setLoading(true);
    fixture.detectChanges();
    mockLoading.setLoading(false);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const overlay = el.querySelector('[data-testid="global-spinner"]');
    expect(overlay).toBeNull();
  });
});
