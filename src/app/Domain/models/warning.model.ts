export enum WarningTypes {
  RED = 'red',
  ORANGE = 'orange',
  YELLOW = 'yellow',
}

export interface Warning {
  endingTime: number;
  startingTime: number;
  testCase: number;
  user: string;
  warningType: WarningTypes;
}
