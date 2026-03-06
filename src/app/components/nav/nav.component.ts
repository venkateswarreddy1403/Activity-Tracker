import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ViewMode = 'daily' | 'weekly';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  currentView = input<ViewMode>('daily');
  viewChange = output<ViewMode>();

  setView(view: ViewMode) {
    this.viewChange.emit(view);
  }
}
