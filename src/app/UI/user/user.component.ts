import { ActivatedRoute, Router } from '@angular/router';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Chart } from 'chart.js/auto';
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as Dispatchers from '../../Domain/state/dispatchers';
import * as ForecastDataSelector from '../../Domain/state/forecast-data/forecast-data.selector';
import * as TestCaseSelector from '../../Domain/state/test-case/test-case.selector';
import * as UserSelector from '../../Domain/state/user/user.selector';
import { AppState } from '../../Domain/state/app.state';
import { Forecast, ForecastData } from '../../Domain/models/forecast-data.model';
import { TestCase } from '../../Domain/models/test-case.model';
import { User } from '../../Domain/models/user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  params: { username: string, testCase: number } = { username: '', testCase: -Infinity };
  forecastData: ForecastData = { id: -Infinity, location: '', data: [], yMaxValue: 0 };
  forecastData$: Subscription = this.store.pipe(select(ForecastDataSelector.getForecastDataList))
    .subscribe((data: ForecastData[]) => {
      const forecast: ForecastData | undefined = data.find((forecast: ForecastData): boolean => forecast.id === this.params.testCase);
      if (data.length && forecast) {
        this.forecastData = forecast;

        this.addData(this.chart, this.forecastData.data);
        // this.addAnnotation('rgba(255, 99, 132, 0.5)', this.chart, 15, 25, this.forecastData.yMaxValue, 'box1');
        // this.addAnnotation('rgba(255, 99, 32, 0.5)', this.chart, 19, 29, this.forecastData.yMaxValue, 'box2');
      }
      return this.forecastData;
    });
  tests: TestCase[] = [];
  tests$: Subscription = this.store.pipe(select(TestCaseSelector.getTestCases))
    .subscribe((data: TestCase[]) => this.tests = data);
  users: User[] = [];
  users$: Subscription = this.store.pipe(select(UserSelector.getUsers))
    .subscribe((data: User[]) => this.users = data);

  protected chart: Chart | any;
  protected rex: RegExp = /\D/g;

  constructor(private store: Store<AppState>, private activeRoute: ActivatedRoute, private router: Router) {
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

  addAnnotation(backgroundColor: string, chart: Chart, xMin: number, xMax: number, yMax: number, boxName: string): void {
    let annotations = chart.options.plugins;
    // @ts-ignore
    annotations.annotation.annotations[boxName] = {
      backgroundColor,
      type: 'box',
      xMax,
      xMin,
      yMax,
      yMin: 0
    };
    chart.update();
  }

  onPagination(page: number): void {
    if (page !== this.forecastData.id) {
      this.router.navigateByUrl(`/test/${this.params.username}/${page}`)
        .then((): void => {
          Dispatchers.dispatchInvokeForecastData(this.store, page);
          this.params = { username: this.params.username, testCase: page }
        });
    }
  }

  ngOnInit(): void {
    this.params = {
      username: this.activeRoute.snapshot.params['username'],
      testCase: Number(this.activeRoute.snapshot.params['testCase']),
    };
    if (!this.tests.length) {
      Dispatchers.dispatchInvokeTestCases(this.store);
    }
    if (!this.users.length) {
      Dispatchers.dispatchInvokeUsers(this.store);
      Dispatchers.dispatchInvokeSetSelected(this.store, { name: this.params.username, testCase: this.params.testCase });
    }
    Chart.register(annotationPlugin);
    Dispatchers.dispatchInvokeForecastData(this.store, this.params.testCase);
    this.createChart();
  }

  protected readonly Number: NumberConstructor = Number;
}
