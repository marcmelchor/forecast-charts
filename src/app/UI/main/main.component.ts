import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as UserSelector from '../../Domain/state/user/user.selector';
import { Dispatchers } from '../../Domain/state/dispatchers';
import { AppState } from '../../Domain/state/app.state';
import { User } from '../../Domain/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  users: User[] = [];
  users$: Subscription = this.store.pipe(select(UserSelector.getUsers))
    .subscribe((users: User[]) => this.users = users);

  constructor(private store: Store<AppState>, private router: Router, private dispatchers: Dispatchers) {
  }

  ngOnInit(): void {
    this.dispatchers.invokeUsers();
    this.dispatchers.invokeTestCases();
  }

  onSelectUser(selected: Event): void {
    const target: HTMLSelectElement = selected.target as HTMLSelectElement;
    if (target.value) {
      this.router.navigate([`/test/${target.value}/1`]).then();
    }
  }
}
