import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityService } from '../../services/activity.service';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-list.component.html',
  styleUrl: './activity-list.component.scss'
})
export class ActivityListComponent {
  activityService = inject(ActivityService);
  
  todayActivities = this.activityService.todayActivities;
  totalDuration = this.activityService.todayTotalDuration;

  formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  
  fetchCategoryColor(category?: string): string {
    switch(category) {
      case 'Work': return 'var(--accent-primary)';
      case 'Health': return 'var(--accent-success)';
      case 'Learning': return '#3b82f6'; // blue
      case 'Entertainment': return '#f59e0b'; // amber
      case 'Chores': return '#8b5cf6'; // purple
      default: return 'var(--text-secondary)';
    }
  }

  deleteActivity(id: string) {
    this.activityService.deleteActivity(id);
  }
}
