import { createReducer, on } from '@ngrx/store';

import * as TestCaseActions from './test-case.actions';
import { initialState, TestCaseState } from './test-case.state';
import { TestCase } from '../../models/test-case.model';

const _testCaseReducer = createReducer(
  initialState,
  // Invoke list of test cases
  on(
    TestCaseActions.invokeGetTestCases,
    (state: TestCaseState) => {
      return { ...state };
    }
  ),
  // Get list of test cases
  on(
    TestCaseActions.getTestCases,
    (state: TestCaseState, { testCases }) => {
      let testCaseArray: TestCase[] = [];
      [...testCases].map((value: string) => testCaseArray.push({ testCase: value }));
      return {
        ...state,
        testCaseList: testCaseArray,
      };
    }
  ),
);

export function testCaseReducer(state: any, action: any): TestCaseState {
  return _testCaseReducer(state, action);
}
