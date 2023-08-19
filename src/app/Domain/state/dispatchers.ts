import { Store } from '@ngrx/store';

import * as ForecastActions from './forecast-data/forecast-data.actions';
import * as TestCaseActions from './test-case/test-case.actions';
import * as UserActions from './user/user.actions';
import { AppState } from './app.state';

export function dispatchInvokeForecastData(store: Store<AppState>, forecastId: number): void {
  store.dispatch(ForecastActions.invokeGetForecastData({ forecastId }));
}

export function dispatchInvokeTestCases(store: Store<AppState>): void {
  store.dispatch(TestCaseActions.invokeGetTestCases());
}

export function dispatchInvokeUsers(store: Store<AppState>): void {
  store.dispatch(UserActions.invokeGetUsers());
}
