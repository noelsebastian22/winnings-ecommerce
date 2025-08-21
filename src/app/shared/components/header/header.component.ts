import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store';
import { selectCartTotalItems } from '@core/state/cart/cart.selectors';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  private store = inject(Store<AppState>);

  cartItemCount = toSignal(this.store.select(selectCartTotalItems), {
    initialValue: 0,
  });
}
