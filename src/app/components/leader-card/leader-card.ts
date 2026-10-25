import { Component, input, output } from '@angular/core';
import { GymLeader } from '../../gym-leader.model';

@Component({
  selector: 'app-leader-card',
  imports: [],
  templateUrl: './leader-card.html',
  styleUrl: './leader-card.css'
})
export class LeaderCardComponent {
  leader = input.required<GymLeader>();
  edit = output<string>();
  remove = output<string>();

  protected onEdit(): void {
    if (this.leader()._id) {
      this.edit.emit(this.leader()._id!);
    }
  }

  protected onDelete(): void {
    if (this.leader()._id) {
      this.remove.emit(this.leader()._id!);
    }
  }
}