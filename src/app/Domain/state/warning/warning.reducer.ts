import { createReducer, on } from '@ngrx/store';

import * as WarningActions from './warning.actions';
import { initialState, WarningState } from './warning.state';
import { Warning } from '../../models/warning.model';

const _warningReducer = createReducer(
  initialState,
  // Post warning
  on(
    WarningActions.postWarning,
    (state: WarningState, { warning }) => {
      // In order to not append the same warning from the same user
      if(state.warningsList.find((data: Warning): boolean => JSON.stringify(data) === JSON.stringify(warning))) {
        return { ...state };
      }
      const warningsList: Warning[] = structuredClone(state.warningsList);
      warningsList.push(structuredClone(warning));
      return {
        ...state,
        warningsList,
      }
    }
  ),
  on(
    WarningActions.removeWarning,
    (state: WarningState, { warning }) => {
      const warningsList: Warning[] = structuredClone(state.warningsList).filter((data: Warning): boolean => {
        return JSON.stringify(data) !== JSON.stringify(warning);
      });

      return {
        ...state,
        warningsList,
      }
    }
  ),
);

export function warningReducer(state: any, action: any): WarningState {
  return _warningReducer(state, action);
}
