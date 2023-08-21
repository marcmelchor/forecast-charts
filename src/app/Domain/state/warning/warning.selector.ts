import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Warning } from '../../models/warning.model';
import { WarningState } from './warning.state';

export const WARNING_NAME: string = 'warning';

const getWarningState = createFeatureSelector<WarningState>(WARNING_NAME);

export const getWarningsByTestCase = (testCase: number) => createSelector(getWarningState, (state: WarningState) => {
  let auxWarnings: Warning[] = structuredClone(state.warningsList);
  return auxWarnings.filter((data: Warning): boolean => data.testCase === testCase);
});
