export interface Table {
  data: Item[][];
  headers: string[];
  itemsName: string;
  title: string;
}

export interface Item {
  isAction: boolean;
  tag: string;
  value: string;
}
