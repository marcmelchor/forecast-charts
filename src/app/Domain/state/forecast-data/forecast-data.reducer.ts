import { createReducer, on } from '@ngrx/store';

import * as ForecastDataActions from './forecast-data.actions';
import { Forecast, ForecastData } from '../../models/forecast-data.model';
import { ForecastDataState, initialState } from './forecast-data.state';

const _forecastReducer = createReducer(
  initialState,
  // Invoke forecast data
  on(
    ForecastDataActions.invokeGetForecastData,
    (state: ForecastDataState, { forecastId }) => {
      return { ...state }
    }
  ),
  // Get forecast data
  on(
    ForecastDataActions.getForecastData,
    (state: ForecastDataState, { forecastId, forecastData }) => {
      // In order to not append repeated data, finds for the same id
      if (state.forecastDataList.find((data: ForecastData): boolean => data.id === forecastId)) {
        return { ...state };
      }
      let forecast: ForecastData = structuredClone(forecastData);
      forecast.id = forecastId;
      forecast.yMaxValue = Math.ceil(Math.max(...forecast.data.map((data: Forecast) => data.WIND_GUST)) / 10) * 10;

      // Format time
      forecast.data.map((data: Forecast) => data.Time = data.Time.slice(5, 16).replace('-', '.').replace('T', ' '))
      let forecastDataList: ForecastData[] = structuredClone(state.forecastDataList);
      forecastDataList.push(forecast);

      return {
        ...state,
        forecastDataList,
      };
    }
  ),
);

export function forecastReducer(state: any, action: any): ForecastDataState {
  return _forecastReducer(state, action);
}
