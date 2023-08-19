import { createAction, props } from '@ngrx/store';

export const INVOKE_GET_TEST_CASES: string = '[Get Test Cases] Invoke List of Test Cases';

export const GET_TEST_CASES: string = '[Get Test Cases] Retrieve List of Test Cases';

export const invokeGetTestCases = createAction(
  INVOKE_GET_TEST_CASES,
);

export const getTestCases = createAction(
  GET_TEST_CASES,
  props<{ testCases: string[] }>(),
);
