export enum WarningTypes {
  RED = 'red',
  ORANGE = 'orange',
  YELLOW = 'yellow',
}

export interface WarningModel {
  endingTime: string;
  startingTime: string;
  testCase: string;
  user: string;
  warningType: WarningTypes;
}
