import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map } from 'rxjs';
import { Injectable } from '@angular/core';

import * as ForecastActions from './forecast-data.actions';
import { ForecastDataService } from '../../../Data/services/forecast-data/forecast-data.service';
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
              map((forecastData: ForecastData) => {
                return ForecastActions.getForecastData({ forecastId, forecastData });
              })
            )
        })
      )
  );

  constructor(private actions$: Actions, private forecastService: ForecastDataService) {
  }
}
