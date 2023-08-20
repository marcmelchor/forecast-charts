export enum WarningTypes {
  RED = 'red',
  ORANGE = 'orange',
  YELLOW = 'yellow',
}

export interface Warning {
  endingTime: string;
  startingTime: string;
  testCase: number;
  user: string;
  warningType: WarningTypes;
}
