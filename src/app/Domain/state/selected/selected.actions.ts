import { createAction, props } from '@ngrx/store';

import { Selected } from '../../models/selected.model';

export const SET_SELECTED: string = '[Set Selected] Set Selected';

export const setSelected = createAction(
  SET_SELECTED,
  props<{ selectedUser: Selected }>()
);
