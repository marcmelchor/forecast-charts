import { Warning } from '../../models/warning.model';

export interface WarningState {
  warningsList: Warning[];
}

export const initialState: WarningState = {
  warningsList: [],
}
