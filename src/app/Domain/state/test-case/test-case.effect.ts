import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as TestCaseActions from './test-case.actions';
import { AppState } from '../app.state';
import { TestCaseService } from '../../../Data/services/test-case.service';

@Injectable({ providedIn: 'root' })
export class TestCaseEffect {
  getTestCaseList$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(TestCaseActions.INVOKE_GET_TEST_CASES),
        exhaustMap(() => {
          return this.testCaseService
            .getTestCases()
            .pipe(
              map((data: string[]) => {
                return ({
                  type: TestCaseActions.GET_TEST_CASES,
                  testCases: data,
                });
              })
            )
        })
      )
  );

  constructor(private actions$: Actions, private store: Store<AppState>, private testCaseService: TestCaseService) {
  }
}
