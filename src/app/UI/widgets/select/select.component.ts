import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent {
  @Input() inputData: any;
  @Input() isFlatData: boolean = false;
  @Input() selectAttribute: string = '';
  @Input() defaultSelected: string = '';
  @Input() isIndexTheValue: boolean = false;
  @Output() onSelect: EventEmitter<string> = new EventEmitter<string>()

  onSelected(event: Event): void {
    const target: HTMLSelectElement = event.target as HTMLSelectElement;
    if (target.value) {
      this.onSelect.emit(target.value);
    }
  }
}
