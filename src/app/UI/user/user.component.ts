import { ActivatedRoute, Params, Router } from '@angular/router';
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
  tests: TestCase[] = [];
  tests$: Subscription = this.store.pipe(select(TestCaseSelector.getTestCases))
    .subscribe((data: TestCase[]) => this.tests = data);
  users: User[] = [];
  users$: Subscription = this.store.pipe(select(UserSelector.getUsers))
    .subscribe((data: User[]) => this.users = data);
  selected: Selected = { name: '', testCase: -Infinity };
  forecastData: ForecastData = { id: -Infinity, location: '', data: [], yMaxValue: 0 };
  forecastDataList: ForecastData[] = [];
  warningsByUserAndTestCase: Warning[] = [];
  selected$: Subscription = this.store.pipe(select(SelectedSelector.getSelected))
    .subscribe((selected: Selected): void => {
      if (this.chart instanceof Chart) {
        this.selected = structuredClone(selected);
        // Warnings List
        this.store.pipe(select(WarningSelector.getWarningsByTestCase(this.selected.testCase)))
          .subscribe((warnings: Warning[]): void => {
            this.warningsByUserAndTestCase = warnings.filter((warning: Warning): boolean => {
              return warning.user === this.selected.name;
            })
          });
        // Forecast data
        this.store.pipe(select(ForecastDataSelector.getForecastDataList))
          .subscribe((data: ForecastData[]): void => {
            Dispatchers.dispatchInvokeForecastData(this.store, this.selected.testCase);
            if (data.length) {
              this.forecastDataList = structuredClone(data);

              const forecast: ForecastData | undefined = data.find((item: ForecastData): boolean => {
                return item.id === this.selected.testCase;
              });
              if (forecast) {
                this.forecastData = structuredClone(forecast);
                this.addData(this.forecastData.data);
                if (this.chart.options.plugins.annotation.annotations) {
                  this.deleteAnnotations();
                  this.warningsByUserAndTestCase.map((warning: Warning): void => {
                    this.addAnnotation(
                      this.rgbWarningColor(warning.warningType),
                      warning.startingTime,
                      warning.endingTime,
                      forecast.yMaxValue,
                      `${this.selected.name}-box-${warning.startingTime}-${warning.endingTime}`
                    )
                  })
                }
              }
            }
          });
      }
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
    let plugins = this.chart.options.plugins;
    // @ts-ignore
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

  deleteAnnotations(): void {
    Object.keys(this.chart.options.plugins.annotation.annotations).forEach((key: string): void => {
      delete this.chart.options.plugins.annotation.annotations[key]
    });
    this.chart.update();
  }

  onPagination(page: number): void {
    this.router.navigate([`/test/${this.selected.name}/${page}`]).then();
  }

  colorWarning(warningType: string): WarningTypes {
    if (warningType === this.warningTypes[0]) {
      return WarningTypes.RED;
    }
    if (warningType === this.warningTypes[1]) {
      return WarningTypes.ORANGE;
    }
    return WarningTypes.YELLOW;
  }

  rgbWarningColor(colorWarning: WarningTypes): string {
    return colorWarning === WarningTypes.RED ?
      'rgb(131, 20, 20, 0.5)' :
      colorWarning === WarningTypes.ORANGE ?
        'rgba(246,143,8,0.5)' :
        'rgba(250,217,4,0.5)';
  }

  addWarningType(): void {
    const startingTime: number = Number(this.startingTime);
    const endingTime: number = Number(this.endingTime) + (startingTime + 1);
    const colorWarning: WarningTypes = this.colorWarning(this.warningType);
    Dispatchers.dispatchInvokePostWarning(
      this.store,
      {
        startingTime,
        endingTime,
        testCase: this.selected.testCase,
        user: this.selected.name,
        warningType: colorWarning,
      });
    const color: string = this.rgbWarningColor(colorWarning);
    if (this.forecastData) {
      this.addAnnotation(
        color,
        startingTime,
        endingTime,
        this.forecastData.yMaxValue,
        `${this.selected.name}-box-${startingTime}-${endingTime}`);
    }
    this.startingTime = -Infinity;
    this.endingTime = -Infinity;
    this.warningType = '';
  }

  removeWarningType(startingTime: number, endingTime: number, warning: string): void {
    const warningType: WarningTypes = this.colorWarning(warning);
    Dispatchers.dispatchInvokeRemoveWarning(
      this.store,
      { startingTime, endingTime, testCase: this.selected.testCase, user: this.selected.name, warningType }
    );
    delete this.chart.options.plugins.annotation.annotations[`${this.selected.name}-box-${startingTime}-${endingTime}`];
    this.chart.update();
  }

  switchUser(): void {
    this.router.navigate(['/']).then()
  }

  ngOnInit(): void {
    Chart.register(annotationPlugin);
    this.createChart();
    this.activeRoute.params.subscribe((params: Params): void => {
      Dispatchers.dispatchSetSelected(
        this.store,
        { name: params['username'], testCase: Number(params['testCase']) }
      );
    });
    if (!this.tests.length) {
      Dispatchers.dispatchInvokeTestCases(this.store);
    }
    if (!this.users.length) {
      Dispatchers.dispatchInvokeUsers(this.store);
    }
    Dispatchers.dispatchInvokeForecastData(this.store, this.selected.testCase);
  }

  protected readonly Number: NumberConstructor = Number;
  protected readonly Infinity: number = Infinity;
}
