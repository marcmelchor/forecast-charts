import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() buttonTittle: string = '';
  @Input() primaryButton: boolean = true;
  @Output() onClick: EventEmitter<string> = new EventEmitter<string>();

  buttonClicked() {
    this.onClick.emit('button clicked');
  }
}
