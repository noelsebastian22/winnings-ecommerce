import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
// import { AppState } from '../../store/app.state';
// import { selectCartTotalItems } from '../../store/cart/cart.selectors';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
    // Inject dependencies using the new inject() function
    //   private store = inject(Store<AppState>);

    // Convert the cart count observable to a signal
    //   cartItemCount = toSignal(this.store.select(selectCartTotalItems), {
    //     initialValue: 0,
    //   });
}
