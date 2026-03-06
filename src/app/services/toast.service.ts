import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'motivation';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSignal = signal<ToastMessage[]>([]);
  readonly toasts = this.toastsSignal.asReadonly();

  show(message: string, type: 'success' | 'info' | 'motivation' = 'success', durationMs = 4000) {
    const id = crypto.randomUUID();
    const toast: ToastMessage = { id, message, type };
    
    this.toastsSignal.update(toasts => [...toasts, toast]);

    setTimeout(() => {
      this.remove(id);
    }, durationMs);
  }

  remove(id: string) {
    this.toastsSignal.update(toasts => toasts.filter(t => t.id !== id));
  }
}
