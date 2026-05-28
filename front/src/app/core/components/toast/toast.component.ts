import { Component, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-toast',
  imports: [ToastModule],
  templateUrl: './toast.component.html',
})
export class ToastComponent {
  private readonly _messageService = inject(MessageService);
}
