import { computed, Injectable, Signal, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly _count = signal(0); // active requests

  readonly isLoading: Signal<boolean> = computed(() => this._count() > 0);

  start() {
    this._count.update((c) => c + 1);
  }
  stop() {
    this._count.update((c) => Math.max(0, c - 1));
  }
  reset() {
    this._count.set(0);
  }
}
