import { createFeatureSelector, createSelector } from '@ngrx/store';

import { TestCaseState } from './test-case.state';

export const TEST_CASE_NAME: string = 'testCase';

const getTestCaseState = createFeatureSelector<TestCaseState>(TEST_CASE_NAME);

export const getTestCases = createSelector(getTestCaseState, (state: TestCaseState) => {
  return state.testCaseList;
});
