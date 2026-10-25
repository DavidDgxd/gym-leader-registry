import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { GymLeaderService } from '../../gym-leader';
import { LeaderCardComponent } from '../../components/leader-card/leader-card';

@Component({
  selector: 'app-leader-list',
  imports: [LeaderCardComponent],
  templateUrl: './leader-list.html',
  styleUrl: './leader-list.css'
})
export class LeaderListComponent implements OnInit {
  protected leaderService = inject(GymLeaderService);
  private router = inject(Router);

  selectedRegion = signal<'All' | 'Kanto' | 'Johto' | 'Hoenn'>('All');

  filteredLeaders = computed(() => {
    const region = this.selectedRegion();
    const allLeaders = this.leaderService.leaders();
    if (region === 'All') return allLeaders;
    return allLeaders.filter(l => l.region === region);
  });

  ngOnInit(): void {
    this.leaderService.fetchLeaders();
  }

  protected setFilter(region: 'All' | 'Kanto' | 'Johto' | 'Hoenn'): void {
    this.selectedRegion.set(region);
  }

  protected onEditLeader(id: string): void {
    this.router.navigate(['/leaders', id, 'edit']);
  }

  protected onDeleteLeader(id: string): void {
    const leader = this.leaderService.leaders().find(l => l._id === id);
    const leaderName = leader ? leader.name : 'this leader';
    
    if (confirm(`Remove ${leaderName} from the registry?`)) {
      this.leaderService.deleteLeader(id).subscribe({
        next: () => this.leaderService.fetchLeaders(),
        error: (err) => console.error('Delete failed:', err)
      });
    }
  }
}