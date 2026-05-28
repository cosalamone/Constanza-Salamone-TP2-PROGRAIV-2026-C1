import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private readonly messageService: MessageService) {}

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: message });
  }

  showWarning(message: string) {
    this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: message });
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

  showInfo(message: string) {
    this.messageService.add({ severity: 'info', summary: 'Información', detail: message });
  }
}
