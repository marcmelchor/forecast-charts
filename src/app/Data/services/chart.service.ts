import annotationPlugin from 'chartjs-plugin-annotation';
import { Chart } from 'chart.js/auto';
import { Injectable } from '@angular/core';

import { Forecast } from '../../Domain/models/forecast-data.model';

@Injectable({ providedIn: 'root' })
export class ChartService {
  chart: Chart | any;
  constructor() {
  }

  createChart(chartName: string): void {
    Chart.register(annotationPlugin);
    this.chart = new Chart(chartName, {
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

  addChart(forestData: Forecast[]): void {
    this.chart.data.labels = forestData.map((data: Forecast) => data.Time);
    this.chart.data.datasets[0].data = forestData.map((data: Forecast) => data.WIND_GUST);
    this.chart.update();
  }

  addWarning(backgroundColor: string, xMin: number, xMax: number, yMax: number, boxName: string): void {
    let plugins = this.chart.options.plugins;
    plugins.annotation.annotations[boxName] = {
      backgroundColor,
      scaleId: 'y',
      type: 'box',
      xMax,
      xMin,
      yMax,
      yMin: 0
    };
    this.chart.update();
  }

  deleteWarnings(): void {
    Object.keys(this.chart.options.plugins.annotation.annotations).forEach((key: string): void => {
      delete this.chart.options.plugins.annotation.annotations[key];
    });
    this.chart.update();
  }

  deleteWarning(warningName: string): void {
    delete this.chart.options.plugins.annotation.annotations[warningName];
    this.chart.update();
  }
}
