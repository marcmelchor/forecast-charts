import { TestCase } from '../../models/test-case.model';

export interface TestCaseState {
  testCaseList: TestCase[];
}

export const initialState: TestCaseState = {
  testCaseList: [],
}
