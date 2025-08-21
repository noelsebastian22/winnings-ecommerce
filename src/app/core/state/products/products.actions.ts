import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Product } from '@infrastructure/models';

export const ProductsActions = createActionGroup({
  source: 'Products',
  events: {
    'Load Products': emptyProps(),
    'Load Products Success': props<{ products: Product[] }>(),
  },
});
