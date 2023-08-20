import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ForecastDataState } from './forecast-data.state';
import { ForecastData } from '../../models/forecast-data.model';

export const FORECAST_DATA_NAME: string = 'forecast';

const getForecastState = createFeatureSelector<ForecastDataState>(FORECAST_DATA_NAME);

export const getForecastData = (forecastId: number) => createSelector(getForecastState, (state: ForecastDataState) => {
  return state.forecastDataList.find((data: ForecastData) => data.id === forecastId);
});

export const getForecastDataList = createSelector(getForecastState, (state: ForecastDataState) => {
  return state.forecastDataList;
})
