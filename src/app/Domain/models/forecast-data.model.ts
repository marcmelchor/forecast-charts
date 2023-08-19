export interface ForecastData {
  id?: number;
  location: string;
  data: Forecast[];
  yMaxValue: number;
}

export interface Forecast {
  Time: string;
  WIND_GUST_ACC: number;
  WIND_GUST: number;
  Warning: string;
  Validity: string;
  Intensity: string;
}
