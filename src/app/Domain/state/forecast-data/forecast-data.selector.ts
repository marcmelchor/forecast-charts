import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ForecastDataState } from './forecast-data.state';

export const FORECAST_DATA_NAME: string = 'forecast';

const getForecastState = createFeatureSelector<ForecastDataState>(FORECAST_DATA_NAME);

export const getForecastDataList = createSelector(getForecastState, (state: ForecastDataState) => {
  return state.forecastDataList;
})
