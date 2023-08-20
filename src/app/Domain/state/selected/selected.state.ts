import { Selected } from '../../models/selected.model';

export interface SelectedState {
  selectedUser: Selected;
}

export const initialState: SelectedState = {
  selectedUser: { name: '', testCase: -Infinity },
}
