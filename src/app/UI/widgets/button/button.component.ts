import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  button = {
    primary: 'primary',
    secondary: 'secondary',
    smallPrimary: 'small-primary',
    smallSecondary: 'small-secondary',
  }
  @Input() buttonTittle: string = '';
  @Input() buttonType: string = this.button.primary;
  @Output() onClick: EventEmitter<string> = new EventEmitter<string>();

  buttonClicked(): void {
    this.onClick.emit('button clicked');
  }
}
