import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { Item, Table } from './table.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnChanges {
  @Input() itemsOnPage: number = 5;
  @Input() table: Table = { data: [], headers: [], itemsName: '', title: '' };
  @Output() action: EventEmitter<number> = new EventEmitter<number>();

  protected data: Item[][] = [];
  protected numberOfPages: number = 0;
  protected startPagination: number = 1;

  ngOnInit(): void {
    this.numberOfPages = Math.ceil(this.table.data.length / this.itemsOnPage);
    this.data = this.filteredData();
  }

  filteredData(): Item[][] {
    return this.table.data.filter((_: Item[], idx: number) => {
      return (((this.startPagination - 1) * this.itemsOnPage) < idx + 1) && (idx + 1 <= this.startPagination * this.itemsOnPage);
    });
  }

  onAction(id: number): void {
    this.action.emit(id);
  }

  onBoardPagination(page: number): void {
    this.startPagination = page;
    this.data = this.filteredData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.numberOfPages = Math.ceil(this.table.data.length / this.itemsOnPage);
    this.table.data = changes['table'].currentValue.data;
    /*
      When there are multiple pages and is removed the only item from the last page, it forces the return to the
      (n-page - 1)
    */
    if (this.startPagination > this.numberOfPages && !changes['table'].firstChange && this.startPagination > 1) {
      this.startPagination--;
      if (this.startPagination > this.numberOfPages) {
        this.startPagination = 1;
      }
    }
    this.data = this.filteredData();
  }

  protected readonly Array: ArrayConstructor = Array;
}
