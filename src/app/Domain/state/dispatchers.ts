import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as ForecastActions from './forecast-data/forecast-data.actions';
import * as SelectedActions from './selected/selected.actions';
import * as TestCaseActions from './test-case/test-case.actions';
import * as UserActions from './user/user.actions';
import * as WarningActions from './warning/warning.actions';
import { AppState } from './app.state';
import { Selected } from '../models/selected.model';
import { Warning } from '../models/warning.model';

@Injectable({ providedIn: 'root' })
export class Dispatchers {
  constructor(private store: Store<AppState>) {
  }

  invokeForecastData(forecastId: number): void {
    this.store.dispatch(ForecastActions.invokeGetForecastData({ forecastId }));
  }

  invokeTestCases(): void {
    this.store.dispatch(TestCaseActions.invokeGetTestCases());
  }

  invokeUsers(): void {
    this.store.dispatch(UserActions.invokeGetUsers());
  }

  invokePostWarning(warning: Warning): void {
    this.store.dispatch(WarningActions.postWarning({ warning }));
  }

  invokeRemoveWarning(warning: Warning): void {
    this.store.dispatch(WarningActions.removeWarning({ warning }));
  }

  setSelected(selectedUser: Selected): void {
    this.store.dispatch(SelectedActions.setSelected({ selectedUser }));
  }
}
