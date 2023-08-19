import * as fromForecastData from './forecast-data/forecast-data.reducer';
import * as fromTestCase from './test-case/test-case.reducer';
import * as fromUser from './user/user.reducer';
import { TestCaseState } from './test-case/test-case.state';
import { UserState } from './user/user.state';
import { ForecastDataState } from './forecast-data/forecast-data.state';

export interface AppState {
  forecastData: ForecastDataState;
  testCase: TestCaseState;
  user: UserState;
}

export const appReducer = {
  forecastData: fromForecastData.forecastReducer,
  testCase: fromTestCase.testCaseReducer,
  user: fromUser.userReducer,
}
