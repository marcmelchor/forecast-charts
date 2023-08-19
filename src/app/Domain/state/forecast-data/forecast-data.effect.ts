import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as ForecastActions from './forecast-data.actions';
import { AppState } from '../app.state';
import { ForecastDataService } from '../../../Data/services/forecast-data.service';
import { ForecastData } from '../../models/forecast-data.model';

@Injectable({ providedIn: 'root' })
export class ForecastDataEffect {
  getForecastData$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(ForecastActions.invokeGetForecastData),
        exhaustMap(({ forecastId }) => {
          return this.forecastService
            .getForestData(forecastId)
            .pipe(
              map((data: ForecastData) => {
                return ForecastActions.getForecastData({ forecastId, forecastData: data })
              })
            )
        })
      )
  );

  constructor(private actions$: Actions, private store: Store<AppState>, private forecastService: ForecastDataService) {
  }
}