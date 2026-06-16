import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { ToastComponent } from './core/components/toast/toast.component';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ToastComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly sidebarCollapsed = signal(false);

  public ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.sidebarCollapsed.set(window.innerWidth <= 768);
    }
    console.log(environment.apiUrl);
  }
}
