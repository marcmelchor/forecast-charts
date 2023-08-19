import { createAction, props } from '@ngrx/store';

export const INVOKE_GET_USERS: string = '[Get Users] Invoke List of Users';

export const GET_USERS: string = '[Get Users] Retrieve List of Users';

export const invokeGetUsers = createAction(
  INVOKE_GET_USERS,
);

export const getUsers = createAction(
  GET_USERS,
  props<{ users: string[] }>(),
);
