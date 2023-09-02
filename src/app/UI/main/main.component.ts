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
  teamMembers = [
    {
      src: 'assets/profile.jpg',
      name: 'James Alexander',
      alias: '@james',
      email: 'james@example.com',
      status: 'active',
      tags: ['dev', 'QA']
    },
    {
      src: 'assets/liliya.jpg',
      name: 'Lilia Taylor',
      alias: '@lilia',
      email: 'lilia.taylor@example.com',
      status: 'active',
      tags: ['design', 'marketing']
    },
    {
      src: 'assets/drew.jpg',
      name: 'Drew Cano',
      email: 'drew.crano@example.com',
      alias: '@drew',
      status: 'inactive',
      tags: ['design', 'marketing']
    },

    {
      src: 'assets/nate.jpg',
      name: 'Nate Conor',
      email: 'nate@example.com',
      alias: '@nate',
      status: 'offline',
      tags: ['dev']
    },
    {
      name: 'Melissa Brantley',
      src: 'assets/melissa.jpg',
      email: 'melissa@example.com',
      alias: '@melissa',
      status: 'active',
      tags: ['marketing']
    },
    {
      name: 'Anna Smith',
      src: 'assets/anna.jpg',
      email: 'anna.smith@example.com',
      alias: '@anna',
      status: 'active',
      tags: ['marketing', 'design']
    },
    {
      src: 'assets/natalia.jpg',
      name: 'Natalia Alexandra',
      email: 'natalia@example.com',
      alias: '@natalia',
      status: 'inactive',
      tags: ['dev', 'marketing']
    },
  ];

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
