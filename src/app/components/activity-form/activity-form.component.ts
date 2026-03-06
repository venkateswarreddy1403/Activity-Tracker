import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivityService } from '../../services/activity.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activity-form.component.html',
  styleUrl: './activity-form.component.scss'
})
export class ActivityFormComponent {
  private activityService = inject(ActivityService);
  private toastService = inject(ToastService);
  
  name = '';
  hours: number | null = null;
  minutes: number | null = null;
  notes = '';
  category = 'Work';
  
  categories = ['Work', 'Health', 'Learning', 'Entertainment', 'Chores', 'Other'];

  onSubmit() {
    // Treat null/undefined as 0
    const h = typeof this.hours === 'number' ? this.hours : 0;
    const m = typeof this.minutes === 'number' ? this.minutes : 0;
    
    if (!this.name || (h === 0 && m === 0)) return;
    
    const totalMinutes = (h * 60) + m;
    
    this.activityService.addActivity({
      name: this.name,
      durationMinutes: totalMinutes,
      notes: this.notes,
      category: this.category
    });
    
    // Trigger toast achievement based on time
    if (totalMinutes > 120) {
      this.toastService.show(`Incredible! You just logged ${totalMinutes} minutes for ${this.name}! 🚀`, 'motivation');
    } else {
      this.toastService.show(`Activity logged successfully! Keep it up.`, 'success');
    }
    
    // Reset form
    this.name = '';
    this.hours = null;
    this.minutes = null;
    this.notes = '';
    this.category = 'Work';
  }
}
