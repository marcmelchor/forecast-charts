import * as fromForecastData from './forecast-data/forecast-data.reducer';
import * as fromSelected from './selected/selected.reducer';
import * as fromTestCase from './test-case/test-case.reducer';
import * as fromUser from './user/user.reducer';
import * as fromWarning from './warning/warning.reducer';
import { ForecastDataState } from './forecast-data/forecast-data.state';
import { TestCaseState } from './test-case/test-case.state';
import { SelectedState } from './selected/selected.state';
import { UserState } from './user/user.state';
import { WarningState } from './warning/warning.state';

export interface AppState {
  forecast: ForecastDataState;
  selected: SelectedState;
  testCase: TestCaseState;
  user: UserState;
  warning: WarningState,
}

export const appReducer = {
  forecast: fromForecastData.forecastReducer,
  selected: fromSelected.selectedReducer,
  testCase: fromTestCase.testCaseReducer,
  user: fromUser.userReducer,
  warning: fromWarning.warningReducer,
}
