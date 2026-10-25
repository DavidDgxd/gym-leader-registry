import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GymLeaderService } from '../../gym-leader';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  protected leaderService = inject(GymLeaderService);

  ngOnInit(): void {
    this.leaderService.fetchLeaders();
  }
}