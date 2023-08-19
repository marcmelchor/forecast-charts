import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as Dispatchers from '../../Domain/state/dispatchers';
import * as ForecastDataSelector from '../../Domain/state/forecast-data/forecast-data.selector';
import annotationPlugin from 'chartjs-plugin-annotation';
import { AppState } from '../../Domain/state/app.state';
import { Chart } from 'chart.js/auto';
import { Forecast, ForecastData } from '../../Domain/models/forecast-data.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  forestData: ForecastData = { id: -Infinity, location: '', data: [], yMaxValue: 0 };
  forecastData$ = this.store.pipe(select(ForecastDataSelector.getForecastData(6)))
    .subscribe((data: ForecastData | undefined) => {
      this.forestData.id = data?.id;
      this.forestData.location = data?.location ?? '';
      this.forestData.data = data?.data ?? [];
      this.forestData.yMaxValue = data?.yMaxValue ?? 0;
      if (this.forestData.id) {
        this.addData(this.chart, this.forestData.data);
        this.addAnnotation('rgba(255, 99, 132, 0.25)', this.chart, 15, 25, this.forestData.yMaxValue);
      }
      return this.forestData;
    });
  protected chart: Chart | any;

  constructor(private store: Store<AppState>) {
  }

  createChart(): void {
    this.chart = new Chart('forecast-data', {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            borderColor: 'rgb(75, 192, 192)',
            data: [],
            label: 'WIND_GUST',
            fill: false,
            pointStyle: false,
            tension: 0.1,
          },
        ]
      },
      options: {
        plugins: {
          annotation: {
            annotations: {}
          }
        }
      }
    });
  }

  addData(chart: Chart, forestData: Forecast[]): void {
    chart.data.labels = forestData.map((data: Forecast) => data.Time);
    chart.data.datasets[0].data = forestData.map((data: Forecast) => data.WIND_GUST);
    chart.update();
  }

  addAnnotation(backgroundColor: string, chart: Chart, xMin: number, xMax: number, yMax: number): void {
    let annotations = chart.options.plugins;
    // @ts-ignore
    annotations.annotation.annotations['box1'] = {
      type: 'box',
      xMin,
      xMax,
      yMin: 0,
      yMax,
      backgroundColor
    };
    chart.update();
  }

  ngOnInit(): void {
    Chart.register(annotationPlugin);
    Dispatchers.dispatchInvokeForecastData(this.store, 6);
    Dispatchers.dispatchInvokeTestCases(this.store);
    Dispatchers.dispatchInvokeUsers(this.store);
    this.createChart();
  }
}
