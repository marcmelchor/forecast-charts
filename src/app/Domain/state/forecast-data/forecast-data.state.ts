import { ForecastData } from '../../models/forecast-data.model';

export interface ForecastDataState {
  forecastDataList: ForecastData[];
}

export const initialState: ForecastDataState = {
  forecastDataList: [],
}
