import { Action, ActionReducer, createReducer, on } from '@ngrx/store';

import * as UserActions from './user.actions';
import { initialState, UserState } from './user.state';
import { User } from '../../models/user.model';

const _userReducer: ActionReducer<UserState, Action> = createReducer(
  initialState,
  // Invoke list of users
  on(
    UserActions.invokeGetUsers,
    (state: UserState) => {
      return { ...state };
    }
  ),
  // Get list of users
  on(
    UserActions.getUsers,
    (state: UserState, { users }) => {
      let userArray: User[] = [];
      [...users].map((value: string) => userArray.push({ name: value }));
      return {
        ...state,
        userList: userArray,
      };
    }
  ),
);

export function userReducer(state: any, action: any): UserState {
  return _userReducer(state, action);
}
