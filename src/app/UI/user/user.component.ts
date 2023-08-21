import { ActivatedRoute, Router } from '@angular/router';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Chart } from 'chart.js/auto';
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as Dispatchers from '../../Domain/state/dispatchers';
import * as ForecastDataSelector from '../../Domain/state/forecast-data/forecast-data.selector';
import * as SelectedSelector from '../../Domain/state/selected/selected.selector';
import * as TestCaseSelector from '../../Domain/state/test-case/test-case.selector';
import * as UserSelector from '../../Domain/state/user/user.selector';
import * as WarningSelector from '../../Domain/state/warning/warning.selector';
import { AppState } from '../../Domain/state/app.state';
import { Forecast, ForecastData } from '../../Domain/models/forecast-data.model';
import { TestCase } from '../../Domain/models/test-case.model';
import { User } from '../../Domain/models/user.model';
import { Selected } from '../../Domain/models/selected.model';
import { Warning, WarningTypes } from '../../Domain/models/warning.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  params: { username: string, testCase: number } = {
    username: this.activeRoute.snapshot.params['username'],
    testCase: Number(this.activeRoute.snapshot.params['testCase']),
  };
  forecastData: ForecastData = { id: -Infinity, location: '', data: [], yMaxValue: 0 };
  forecastDataList: ForecastData[] = [];
  forecastData$: Subscription = this.store.pipe(select(ForecastDataSelector.getForecastDataList))
    .subscribe((data: ForecastData[]) => {
      if (data.length) {
        this.forecastDataList = data;

        const forecast: ForecastData | undefined = data.find((item: ForecastData): boolean => item.id === this.params.testCase);
        if (forecast) {
          this.forecastData = structuredClone(forecast);
          this.addData(this.forecastData.data);
        }
      }
      return this.forecastData;
    });
  tests: TestCase[] = [];
  tests$: Subscription = this.store.pipe(select(TestCaseSelector.getTestCases))
    .subscribe((data: TestCase[]) => this.tests = data);
  users: User[] = [];
  users$: Subscription = this.store.pipe(select(UserSelector.getUsers))
    .subscribe((data: User[]) => this.users = data);
  selected: Selected = { name: '', testCase: -Infinity };
  selected$: Subscription = this.store.pipe(select(SelectedSelector.getSelected))
    .subscribe((data: Selected) => this.selected = structuredClone(data));
  warningsByUserAndTestCase: Warning[] = [];
  warnings$: Subscription = this.store.pipe(select(WarningSelector.getWarningsByTestCase(this.params.testCase)))
    .subscribe((data: Warning[]): void => {
      this.warningsByUserAndTestCase = data.filter((value: Warning): boolean => {
        return value.user === this.selected.name;
      })
    });

  protected chart: Chart | any;
  protected rex: RegExp = /\D/g;
  protected warningTypes: string[] = ['red', 'orange', 'yellow'];
  protected startingTime: number = -Infinity;
  protected endingTime: number = -Infinity;
  protected warningType: string = '';

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

  addData(forestData: Forecast[]): void {
    this.chart.data.labels = forestData.map((data: Forecast) => data.Time);
    this.chart.data.datasets[0].data = forestData.map((data: Forecast) => data.WIND_GUST);
    this.chart.update();
  }

  addAnnotation(backgroundColor: string, xMin: number, xMax: number, yMax: number, boxName: string): void {
    let annotations = this.chart.options.plugins;
    // @ts-ignore
    annotations.annotation.annotations[boxName] = {
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

  onPagination(page: number): void {
    if (page !== this.forecastData.id) {
      this.router.navigateByUrl(`/test/${this.params.username}/${page}`)
        .then((): void => {
          this.params = { username: this.params.username, testCase: page };
          Dispatchers.dispatchInvokeForecastData(this.store, page);
          Dispatchers.dispatchInvokeSetSelected(this.store, {
            name: this.params.username,
            testCase: this.params.testCase
          });
          const nextForecast: ForecastData | undefined = this.forecastDataList.find(
            (forecast: ForecastData): boolean => page === forecast.id
          );
          this.store.pipe(select(WarningSelector.getWarningsByTestCase(this.params.testCase)))
            .subscribe((data: Warning[]): void => {
              this.warningsByUserAndTestCase = data.filter((value: Warning): boolean => {
                return value.user === this.selected.name;
              })
            });
          Object.keys(this.chart.options.plugins.annotation.annotations).forEach((key: string): void => {
            delete this.chart.options.plugins.annotation.annotations[key]
          });
          this.chart.update();
          if (this.warningsByUserAndTestCase.length) {
            this.warningsByUserAndTestCase.map((warning: Warning): void => {
              const colorWarning: WarningTypes = this.colorWarning(warning.warningType);
              const color =
                colorWarning === WarningTypes.RED ?
                  'rgb(131, 20, 20, 0.5)' :
                  colorWarning === WarningTypes.ORANGE ?
                    'rgba(246,143,8,0.5)' :
                    'rgba(250,217,4,0.5)';
              this.addAnnotation(
                color,
                warning.startingTime,
                warning.endingTime,
                this.forecastData.yMaxValue,
                `${this.selected.name}-box-${warning.startingTime}-${warning.endingTime}`
              );
            })
          }
          // If forecast data already exists on `forecastData` just update chart.
          if (nextForecast) {
            this.forecastData = nextForecast;
            this.addData(this.forecastData.data);
          }
        });
    }
  }

  colorWarning(warningType: string): WarningTypes {
    if (warningType === this.warningTypes[0]) {
      return WarningTypes.RED;
    } if (warningType === this.warningTypes[1]) {
      return WarningTypes.ORANGE;
    }
    return WarningTypes.YELLOW;
  }

  addWarningType(): void {
    const colorWarning: WarningTypes = this.colorWarning(this.warningType);
    Dispatchers.dispatchInvokePostWarning(
      this.store,
      {
        startingTime: Number(this.startingTime),
        endingTime: Number(this.endingTime),
        testCase: this.selected.testCase,
        user: this.selected.name,
        warningType: colorWarning,
      });
    const color =
      colorWarning === WarningTypes.RED ?
        'rgb(131, 20, 20, 0.5)' :
        colorWarning === WarningTypes.ORANGE ?
          'rgba(246,143,8,0.5)' :
          'rgba(250,217,4,0.5)';
    this.addAnnotation(
      color,
      Number(this.startingTime),
      Number(this.endingTime),
      this.forecastData.yMaxValue,
      `${this.selected.name}-box-${this.startingTime}-${this.endingTime}`);
    this.startingTime = -Infinity;
    this.endingTime = -Infinity;
    this.warningType = '';
  }

  removeWarningType(startingTime: number, endingTime: number, warning: string): void {
    const warningType: WarningTypes = this.colorWarning(warning);
    Dispatchers.dispatchInvokeRemoveWarning(
      this.store,
      { startingTime, endingTime, testCase: this.params.testCase, user: this.params.username, warningType }
    );
    delete this.chart.options.plugins.annotation.annotations[`${this.selected.name}-box-${startingTime}-${endingTime}`];
    this.chart.update();
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
    }
    Dispatchers.dispatchInvokeSetSelected(this.store, { name: this.params.username, testCase: this.params.testCase });
    Chart.register(annotationPlugin);
    Dispatchers.dispatchInvokeForecastData(this.store, this.params.testCase);
    this.createChart();
  }

  protected readonly Number: NumberConstructor = Number;
  protected readonly Infinity: number = Infinity;
}
