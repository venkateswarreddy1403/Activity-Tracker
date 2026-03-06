import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent, ViewMode } from './components/nav/nav.component';
import { DailyViewComponent } from './components/daily-view/daily-view.component';
import { WeeklyViewComponent } from './components/weekly-view/weekly-view.component';
import { ToastComponent } from './components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavComponent, DailyViewComponent, WeeklyViewComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  activeView = signal<ViewMode>('daily');
}
