import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal-card',
  templateUrl: './modal-card.component.html',
  styleUrls: ['./modal-card.component.scss']
})
export class ModalCardComponent {
  @Input() modalName: string = '';
  @Input() hasExit: boolean = true;

  onClose(): void {
    const modalContainer: HTMLDivElement = document.getElementById(this.modalName) as HTMLDivElement;
    modalContainer.classList.add('modal__not-show-content');
  }
}
