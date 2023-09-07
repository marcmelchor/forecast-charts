import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as UserActions from './user.actions';
import { AppState } from '../app.state';
import { UserService } from '../../../Data/services/user/user.service';


@Injectable({ providedIn: 'root' })
export class UserEffect {
  getUsers$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(UserActions.INVOKE_GET_USERS),
        exhaustMap(() => {
          return this.userService
            .getUsers()
            .pipe(
              map((data: string[]) => {
                return ({
                  type: UserActions.GET_USERS,
                  users: data,
                })
              }),
              catchError(err => of(UserActions.getUsers({ users: [] })))
            )
        })
      )
  );

  constructor(private actions$: Actions, private store: Store<AppState>, private userService: UserService) {
  }
}
