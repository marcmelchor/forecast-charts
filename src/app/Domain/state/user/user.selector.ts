import { createFeatureSelector, createSelector } from '@ngrx/store';

import { UserState } from './user.state';

export const USER_NAME: string = 'users';

const getUsersState = createFeatureSelector<UserState>(USER_NAME);

export const getUsers = createSelector(getUsersState, (state: UserState) => {
  return state.userList;
});
