import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityFormComponent } from '../activity-form/activity-form.component';
import { ActivityListComponent } from '../activity-list/activity-list.component';

@Component({
  selector: 'app-daily-view',
  standalone: true,
  imports: [CommonModule, ActivityFormComponent, ActivityListComponent],
  templateUrl: './daily-view.component.html',
  styleUrl: './daily-view.component.scss'
})
export class DailyViewComponent {
}
