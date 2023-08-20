import { createAction, props } from '@ngrx/store';

import { Warning } from '../../models/warning.model';

export const POST_WARNING: string = '[Post Warning] Stored Warning';


export const REMOVE_WARNING: string = '[Remove Warning] Removed Warning';

export const postWarning = createAction(
  POST_WARNING,
  props<{ warning: Warning }>()
);

export const removeWarning = createAction(
  REMOVE_WARNING,
  props<{ warning: Warning }>(),
);
