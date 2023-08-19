import { User } from '../../models/user.model';

export interface UserState {
  userList: User[];
}

export const initialState: UserState = {
  userList: [],
}
