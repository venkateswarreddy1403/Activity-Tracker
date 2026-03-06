import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityService } from '../../services/activity.service';

@Component({
  selector: 'app-weekly-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weekly-view.component.html',
  styleUrl: './weekly-view.component.scss'
})
export class WeeklyViewComponent {
  activityService = inject(ActivityService);
  summary = this.activityService.currentWeeklySummary;

  formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }

  get maxDailyTotal(): number {
    const totals = this.summary().dailyTotals.map(d => d.total);
    const max = Math.max(...totals, 60); // Ensure at least scale of 60m
    return max;
  }

  getBarHeightPercent(minutes: number): number {
    return (minutes / this.maxDailyTotal) * 100;
  }

  getDayName(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }
}
