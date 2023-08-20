import { createReducer, on } from '@ngrx/store';

import * as SelectedActions from './selected.actions';
import { initialState, SelectedState } from './selected.state';

const _selectedReducer = createReducer(
  initialState,
  // Set Selected
  on(
    SelectedActions.setSelected,
    (state: SelectedState, { selectedUser }) => {
      return {
        ...state,
        selectedUser,
      };
    }
  ),
);

export function selectedReducer(state: any, action: any): SelectedState {
  return _selectedReducer(state, action);
}
