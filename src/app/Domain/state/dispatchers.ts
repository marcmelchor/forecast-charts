import { Store } from '@ngrx/store';

import * as ForecastActions from './forecast-data/forecast-data.actions';
import * as SelectedActions from './selected/selected.actions';
import * as TestCaseActions from './test-case/test-case.actions';
import * as UserActions from './user/user.actions';
import * as WarningActions from './warning/warning.actions';
import { AppState } from './app.state';
import { Selected } from '../models/selected.model';
import { Warning } from '../models/warning.model';

export function dispatchInvokeForecastData(store: Store<AppState>, forecastId: number): void {
  store.dispatch(ForecastActions.invokeGetForecastData({ forecastId }));
}

export function dispatchInvokeTestCases(store: Store<AppState>): void {
  store.dispatch(TestCaseActions.invokeGetTestCases());
}

export function dispatchInvokeUsers(store: Store<AppState>): void {
  store.dispatch(UserActions.invokeGetUsers());
}

export function dispatchInvokePostWarning(store: Store<AppState>, warning: Warning): void {
  store.dispatch(WarningActions.postWarning({ warning }));
}

export function dispatchInvokeRemoveWarning(store: Store<AppState>, warning: Warning): void {
  store.dispatch(WarningActions.removeWarning({ warning }));
}

export function dispatchSetSelected(store: Store<AppState>, selectedUser: Selected): void {
  store.dispatch(SelectedActions.setSelected({ selectedUser }));
}
