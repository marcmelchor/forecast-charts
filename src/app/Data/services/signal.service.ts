import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SignalService {
  private message: WritableSignal<string> = signal<string>('');

  constructor() {
  }

  public setMessage(inputMessage: string): void {
    this.message.update(() => inputMessage);
  }

  public getMessage(): string {
    return this.message();
  }
}
