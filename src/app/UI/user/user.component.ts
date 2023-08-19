import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as Dispatchers from '../../Domain/state/dispatchers';
import { AppState } from '../../Domain/state/app.state';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  constructor(private store: Store<AppState>) {
  }
  ngOnInit(): void {
    Dispatchers.dispatchInvokeForecastData(this.store, 6);
    Dispatchers.dispatchInvokeTestCases(this.store);
    Dispatchers.dispatchInvokeUsers(this.store);
    Dispatchers.dispatchInvokeForecastData(this.store, 6);
  }
}
