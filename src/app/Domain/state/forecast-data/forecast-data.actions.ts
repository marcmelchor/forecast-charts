import { createAction, props } from '@ngrx/store';

import { ForecastData } from '../../models/forecast-data.model';

export const INVOKE_GET_FORECAST_DATA: string = '[Get Forecast Data] Invoke Forecast Data';

export const GET_FORECAST_DATA: string = '[Get Forecast Data] Retrieve Forecast Data';

export const invokeGetForecastData = createAction(
  INVOKE_GET_FORECAST_DATA,
  props<{ forecastId: number }>()
);

export const getForecastData = createAction(
  GET_FORECAST_DATA,
  props<{ forecastId: number, forecastData: ForecastData }>(),
);
