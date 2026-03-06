import { Injectable, signal, computed } from '@angular/core';

export interface Activity {
  id: string;
  name: string;
  durationMinutes: number;
  notes?: string;
  category?: string;
  dateStr: string; // YYYY-MM-DD
  timestamp: number;
}

export interface DayActivityList {
  dateStr: string;
  activities: Activity[];
  totalDurationMin: number;
}

export interface WeeklySummary {
  weekStartStr: string; // Monday of the week
  totalDurationMin: number;
  averagePerDayMin: number;
  topCategory: string;
  dailyTotals: { dateStr: string; total: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private STORAGE_KEY = 'activity_tracker_data';
  
  // State
  private activitiesSignal = signal<Activity[]>(this.loadFromStorage());

  // Computed Values
  readonly allActivities = this.activitiesSignal.asReadonly();
  
  readonly todayActivities = computed(() => {
    const todayStr = this.getLocalDateString(new Date());
    return this.activitiesSignal().filter(a => a.dateStr === todayStr);
  });

  readonly todayTotalDuration = computed(() => {
    return this.todayActivities().reduce((acc, curr) => acc + curr.durationMinutes, 0);
  });
  
  // Weekly aggregation
  readonly currentWeeklySummary = computed(() => {
    const today = new Date();
    // find Monday
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(today.setDate(diff));
    
    // gather past 7 days starting from Monday
    const dates: string[] = [];
    for(let i=0; i<7; i++){
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(this.getLocalDateString(d));
    }
    
    const weekActivities = this.activitiesSignal().filter(a => dates.includes(a.dateStr));
    
    const dailyTotals = dates.map(dStr => {
      const dayActs = weekActivities.filter(a => a.dateStr === dStr);
      const total = dayActs.reduce((acc, curr) => acc + curr.durationMinutes, 0);
      return { dateStr: dStr, total };
    });
    
    const totalDurationMin = dailyTotals.reduce((acc, curr) => acc + curr.total, 0);
    const averagePerDayMin = Math.round(totalDurationMin / 7);
    
    // Top Category Calculation
    const categoryCounts: Record<string, number> = {};
    weekActivities.forEach(a => {
      if(a.category) {
        categoryCounts[a.category] = (categoryCounts[a.category] || 0) + a.durationMinutes;
      }
    });
    let topCategory = 'None';
    let max = 0;
    for(const [cat, count] of Object.entries(categoryCounts)){
      if(count > max) { max = count; topCategory = cat; }
    }

    return {
      weekStartStr: this.getLocalDateString(monday),
      totalDurationMin,
      averagePerDayMin,
      topCategory,
      dailyTotals
    } as WeeklySummary;
  });


  constructor() { }

  private loadFromStorage(): Activity[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if(data) {
      try { return JSON.parse(data); } catch(e) { return []; }
    }
    return [];
  }

  private saveToStorage(acts: Activity[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(acts));
  }

  addActivity(activity: Omit<Activity, 'id' | 'timestamp' | 'dateStr'>) {
    const now = new Date();
    const newAct: Activity = {
      ...activity,
      id: crypto.randomUUID(),
      timestamp: now.getTime(),
      dateStr: this.getLocalDateString(now)
    };
    
    this.activitiesSignal.update(acts => {
      const updated = [newAct, ...acts];
      this.saveToStorage(updated);
      return updated;
    });
  }

  deleteActivity(id: string) {
    this.activitiesSignal.update(acts => {
      const updated = acts.filter(a => a.id !== id);
      this.saveToStorage(updated);
      return updated;
    });
  }

  getLocalDateString(date: Date): string {
    const offset = date.getTimezoneOffset();
    const d = new Date(date.getTime() - (offset*60*1000));
    return d.toISOString().split('T')[0];
  }
}
