import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';

import * as ForecastDataSelector from '../../Domain/state/forecast-data/forecast-data.selector';
import * as SelectedSelector from '../../Domain/state/selected/selected.selector';
import * as TestCaseSelector from '../../Domain/state/test-case/test-case.selector';
import * as UserSelector from '../../Domain/state/user/user.selector';
import * as WarningSelector from '../../Domain/state/warning/warning.selector';
import { AppState } from '../../Domain/state/app.state';
import { Dispatchers } from '../../Domain/state/dispatchers';
import { ForecastData } from '../../Domain/models/forecast-data.model';
import { Selected } from '../../Domain/models/selected.model';
import { TestCase } from '../../Domain/models/test-case.model';
import { User } from '../../Domain/models/user.model';
import { Warning, WarningTypes } from '../../Domain/models/warning.model';
import { Item, Table } from '../widgets/table/table.model';

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
      this.selected = structuredClone(selected);
      // Warnings List
      this.store.pipe(select(WarningSelector.getWarningsByTestCase(this.selected.testCase)))
        .subscribe((warnings: Warning[]): void => {
          this.warningsByUserAndTestCase = warnings.filter((warning: Warning): boolean => {
            return warning.user === this.selected.name;
          });
          // Fill Warning table
          if (this.warningTable?.data.length) {
            this.warningTable.data = [];
          }
          this.warningsByUserAndTestCase.map((warning: Warning): void => {
            const item: Item[] = [
              { value: this.forecastData.data[warning.endingTime]?.Time, isAction: false, tag: '' },
              { value: this.forecastData.data[warning.startingTime]?.Time, isAction: false, tag: '' },
              { value: warning.warningType, isAction: false, tag: warning.warningType },
              { value: 'Remove Warning', isAction: true, tag: '' }
            ];
            this.warningTable?.data.push(item);
          });
          /*
             Due to the onChange lifecycle hook only check if the reference has changes, in an object or array this
             reference is not modified, so it's necessary to use the spread operator to create a new reference and then
             trigger the change detention.
           */
          this.warningTable = { ...this.warningTable };
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
              this.yMax = forecast.yMaxValue;
              this.forecastData = structuredClone(forecast);
            }
          }
        });
    });

  protected rex: RegExp = /\D/g;
  protected warningTypes: string[] = ['red', 'orange', 'yellow'];
  protected startingTime: number = -Infinity;
  protected endingTime: number = -Infinity;
  protected warningType: string = '';
  protected resetSelectorsSubject: Subject<string> = new Subject<string>();
  protected warningSelectorGroup: string = 'Warnings';
  protected yMax: number = 0;
  protected warningTable: Table = {
    data: [],
    headers: ['Ending Time', 'Starting Time', 'Warning Type', 'Action'],
    itemsName: 'Warnings',
    title: 'Warnings List',
  };

  constructor(
    private activeRoute: ActivatedRoute,
    private dispatchers: Dispatchers,
    private router: Router,
    private store: Store<AppState>,
  ) {
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

  onPagination(page: number): void {
    this.router.navigate([`/test/${this.selected.name}/${page}`]).then();
  }

  onResetSelectors(): void {
    this.resetSelectorsSubject.next(`${this.warningSelectorGroup} ${Math.random()}`);
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
    this.onResetSelectors();
    this.startingTime = -Infinity;
    this.endingTime = -Infinity;
    this.warningType = '';
  }

  switchUser(): void {
    this.router.navigate(['/']).then();
  }

  reviewTestCase(): void {
    console.log('Review Test Case');
  }

  onActionTable(event: number): void {
    const warning: Warning = this.warningsByUserAndTestCase[event];
    if (warning) {
      this.dispatchers.invokeRemoveWarning(warning);
    }
  }

  ngOnInit(): void {
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
