import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Warning } from '../../models/warning.model';
import { WarningState } from './warning.state';

export const WARNING_NAME: string = 'warningData';

const getWarningState = createFeatureSelector<WarningState>(WARNING_NAME);

export const getWarnings = createSelector(getWarningState, (state: WarningState) => {
  return state.warningsList;
});

export const getWarningsByUser = (userName: string) => createSelector(getWarningState, (state: WarningState) => {
  let auxWarnings: Warning[] = structuredClone(state.warningsList);
  return auxWarnings.filter((data: Warning): boolean => data.user === userName);
});

export const getWarningsByTestCase = (testCase: number) => createSelector(getWarningState, (state: WarningState) => {
  let auxWarnings: Warning[] = structuredClone(state.warningsList);
  return auxWarnings.filter((data: Warning): boolean => data.testCase === testCase);
});

export const getWarningsByUserAndTestCase = (userName: string, testCase: number) => createSelector(getWarningState, (state: WarningState) => {
  let auxWarnings: Warning[] = structuredClone(state.warningsList);
  return auxWarnings.filter((data: Warning): boolean => data.user === userName && data.testCase === testCase);
});
