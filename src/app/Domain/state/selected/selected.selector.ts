import { createFeatureSelector, createSelector } from '@ngrx/store';

import { SelectedState } from './selected.state';

export const SELECTED_NAME: string = 'selected';

const getSelectedState = createFeatureSelector<SelectedState>(SELECTED_NAME);

export const getSelected = createSelector(getSelectedState, (state: SelectedState) => {
  return state.selectedUser;
});
