import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-card',
  templateUrl: './modal-card.component.html',
  styleUrls: ['./modal-card.component.scss']
})
export class ModalCardComponent implements OnInit, OnDestroy {
  private showModalSubscription: Subscription = new Subscription();
  private closeModalSubscription: Subscription = new Subscription();

  @Input() closeModal: Observable<void> = new Observable<void>();
  @Input() hasExit: boolean = true;
  @Input() modalName: string = 'default-modal';
  @Input() showModal: Observable<void> = new Observable<void>();

  constructor() {
  }

  ngOnInit(): void {
    this.showModalSubscription = this.showModal.subscribe((): void => {
      const modalContainer: HTMLDivElement = this.getModalContainer();
      modalContainer.classList.remove('modal__not-show-content');
    });

    this.closeModalSubscription = this.closeModal.subscribe(() => this.onClose());
  }

  onClose(): void {
    const modalContainer: HTMLDivElement = this.getModalContainer();
    modalContainer.classList.add('modal__not-show-content');
  }

  getModalContainer(): HTMLDivElement {
    return document.getElementById(this.modalName) as HTMLDivElement;
  }

  ngOnDestroy(): void {
    this.showModalSubscription.unsubscribe();
    this.closeModalSubscription.unsubscribe();
  }
}
