import { ActivatedRoute, Params, Router } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as ForecastDataSelector from '../../Domain/state/forecast-data/forecast-data.selector';
import * as SelectedSelector from '../../Domain/state/selected/selected.selector';
import * as TestCaseSelector from '../../Domain/state/test-case/test-case.selector';
import * as UserSelector from '../../Domain/state/user/user.selector';
import * as WarningSelector from '../../Domain/state/warning/warning.selector';
import { AppState } from '../../Domain/state/app.state';
import { ChartService } from '../../Data/services/chart.service';
import { Dispatchers } from '../../Domain/state/dispatchers';
import { ForecastData } from '../../Domain/models/forecast-data.model';
import { Selected } from '../../Domain/models/selected.model';
import { SignalService } from '../../Data/services/signal.service';
import { TestCase } from '../../Domain/models/test-case.model';
import { User } from '../../Domain/models/user.model';
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
      if (this.chartService.chart instanceof Chart) {
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
            this.dispatchers.invokeForecastData(this.selected.testCase);
            if (data.length) {
              this.forecastDataList = structuredClone(data);

              const forecast: ForecastData | undefined = data.find((item: ForecastData): boolean => {
                return item.id === this.selected.testCase;
              });
              if (forecast) {
                this.forecastData = structuredClone(forecast);
                this.chartService.addChart(this.forecastData.data);
                if (this.chartService.chart.options.plugins.annotation.annotations) {
                  this.chartService.deleteWarnings();
                  this.warningsByUserAndTestCase.map((warning: Warning): void => {
                    this.chartService.addWarning(
                      this.rgbWarningColor(warning.warningType),
                      warning.startingTime,
                      warning.endingTime,
                      forecast.yMaxValue,
                      `${this.selected.name}-box-${warning.startingTime}-${warning.endingTime}`
                    );
                  })
                }
              }
            }
          });
      }
    });

  protected rex: RegExp = /\D/g;
  protected warningTypes: string[] = ['red', 'orange', 'yellow'];
  protected startingTime: number = -Infinity;
  protected endingTime: number = -Infinity;
  protected warningType: string = '';

  constructor(
    private activeRoute: ActivatedRoute,
    protected chartService: ChartService,
    private dispatchers: Dispatchers,
    private router: Router,
    private signalService: SignalService,
    private store: Store<AppState>,
  ) {
  }

  onPagination(page: number): void {
    this.router.navigate([`/test/${this.selected.name}/${page}`]).then();
  }

  protected colorWarning(warningType: string): WarningTypes {
    if (warningType === this.warningTypes[0]) {
      return WarningTypes.RED;
    }
    if (warningType === this.warningTypes[1]) {
      return WarningTypes.ORANGE;
    }
    return WarningTypes.YELLOW;
  }

  protected rgbWarningColor(colorWarning: WarningTypes): string {
    return colorWarning === WarningTypes.RED ?
      'rgb(131, 20, 20, 0.5)' :
      colorWarning === WarningTypes.ORANGE ?
        'rgba(246,143,8,0.5)' :
        'rgba(250,217,4,0.5)';
  }

  onSelectStarting(selected: Event): void {
    const target: HTMLSelectElement = selected.target as HTMLSelectElement;
    if (target.value) {
      this.startingTime = Number(target.value);
    }
  }

  onSelectEnding(selected: Event): void {
    const target: HTMLSelectElement = selected.target as HTMLSelectElement;
    if (target.value) {
      this.endingTime = Number(target.value);
    }
  }

  onSelectWarning(selected: Event): void {
    const target: HTMLSelectElement = selected.target as HTMLSelectElement;
    if (target.value) {
      this.warningType = target.value;
    }
  }

  addWarningType(): void {
    const startingTime: number = Number(this.startingTime);
    const endingTime: number = Number(this.endingTime) + (startingTime + 1);
    const colorWarning: WarningTypes = this.colorWarning(this.warningType);
    this.dispatchers.invokePostWarning({
      startingTime,
      endingTime,
      testCase: this.selected.testCase,
      user: this.selected.name,
      warningType: colorWarning,
    });
    const color: string = this.rgbWarningColor(colorWarning);
    if (this.forecastData) {
      this.chartService.addWarning(
        color,
        startingTime,
        endingTime,
        this.forecastData.yMaxValue,
        `${this.selected.name}-box-${startingTime}-${endingTime}`);
    }
    this.signalService.setMessage(`Warning Selector ${Math.random()}`);
    this.startingTime = -Infinity;
    this.endingTime = -Infinity;
    this.warningType = '';
  }

  removeWarningType(startingTime: number, endingTime: number, warning: string): void {
    const warningType: WarningTypes = this.colorWarning(warning);
    this.dispatchers.invokeRemoveWarning({
      startingTime,
      endingTime,
      testCase: this.selected.testCase,
      user: this.selected.name,
      warningType,
    });
    this.chartService.deleteWarning(`${this.selected.name}-box-${startingTime}-${endingTime}`);
  }

  switchUser(): void {
    this.router.navigate(['/']).then()
  }

  reviewTestCase(): void {
    console.log('Review Test Case');
  }

  ngOnInit(): void {
    this.chartService.createChart('forecast-data');
    this.activeRoute.params.subscribe((params: Params): void => {
      this.dispatchers.setSelected({ name: params['username'], testCase: Number(params['testCase']) });
    });
    if (!this.tests.length) {
      this.dispatchers.invokeTestCases();
    }
    if (!this.users.length) {
      this.dispatchers.invokeUsers();
    }
    this.dispatchers.invokeForecastData(this.selected.testCase);
  }

  protected readonly Number: NumberConstructor = Number;
  protected readonly Infinity: number = Infinity;
}
