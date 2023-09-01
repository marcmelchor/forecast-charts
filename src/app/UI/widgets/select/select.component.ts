import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit, OnDestroy {
  private resetSubscription: Subscription = new Subscription();

  @Input() defaultSelected: string = '';
  @Input() group: string = '';
  @Input() inputData: any;
  @Input() isIndexTheValue: boolean = false;
  @Input() reset: Observable<string> = new Observable<string>();
  @Input() selectAttribute!: string;
  @Output() onSelect: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit(): void {
    this.resetSubscription = this.reset.subscribe((value: string): void => {
      if (value.includes(this.group)) {
        const selectElement: HTMLSelectElement = document.
          getElementById(`selector-${this.group}-${this.defaultSelected}`) as HTMLSelectElement;
        selectElement.value = this.defaultSelected;
      }
    });
  }

  onSelected(event: Event): void {
    const target: HTMLSelectElement = event.target as HTMLSelectElement;
    if (target.value) {
      this.onSelect.emit(target.value);
    }
  }

  isString(inputData: Object | string): boolean {
    return typeof inputData === 'string';
  }

  ngOnDestroy(): void {
    this.resetSubscription.unsubscribe();
  }
}
