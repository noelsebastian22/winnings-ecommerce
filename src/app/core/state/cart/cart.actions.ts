import { Product } from '@infrastructure/models';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const CartActions = createActionGroup({
  source: 'Cart',
  events: {
    'Add To Cart': props<{ product: Product }>(),
    'Remove From Cart': props<{ productSku: string }>(),
    'Update Quantity': props<{ productSku: string; quantity: number }>(),
    'Clear Cart': emptyProps(),
  },
});
