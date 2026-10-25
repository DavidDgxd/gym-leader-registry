import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GymLeader } from './gym-leader.model';

@Injectable({
  providedIn: 'root'
})
export class GymLeaderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/leaders';

  // State management using Signals
  leaders = signal<GymLeader[]>([]);

  // Computed signals for region leader counts
  kantoCount = computed(() => this.leaders().filter(l => l.region === 'Kanto').length);
  johtoCount = computed(() => this.leaders().filter(l => l.region === 'Johto').length);
  hoennCount = computed(() => this.leaders().filter(l => l.region === 'Hoenn').length);

  fetchLeaders(): void {
    this.http.get<GymLeader[]>(this.apiUrl).subscribe({
      next: (data) => this.leaders.set(data),
      error: (err) => console.error('Error fetching leaders:', err)
    });
  }

  getLeader(id: string): Observable<GymLeader> {
    return this.http.get<GymLeader>(`${this.apiUrl}/${id}`);
  }

  addLeader(leader: GymLeader): Observable<GymLeader> {
    return this.http.post<GymLeader>(this.apiUrl, leader);
  }

  updateLeader(id: string, leader: GymLeader): Observable<GymLeader> {
    return this.http.put<GymLeader>(`${this.apiUrl}/${id}`, leader);
  }

  deleteLeader(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}