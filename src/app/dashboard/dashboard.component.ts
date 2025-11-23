import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ChallengeService } from '../services/challenge.service';
import { Store } from '../models/store.model';
import { Fragment } from '../models/fragment.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  progress: {
    storesUnlocked: number,
    totalStores: number,
    fragmentsUnlocked: number,
    totalFragments: number
  } = { storesUnlocked: 0, totalStores: 0, fragmentsUnlocked: 0, totalFragments: 0 };

  unlockedFragments: Fragment[] = [];
  storePercentage: number = 0;
  fragmentPercentage: number = 0;

  constructor(private challengeService: ChallengeService, private router: Router) {}

  ngOnInit(): void {
    this.loadProgress();
    this.loadUnlockedFragments();
  }

  private loadProgress(): void {
    this.challengeService.getChallengeProgress().subscribe(
      progress => {
        this.progress = progress;
        this.storePercentage = (this.progress.storesUnlocked / this.progress.totalStores) * 100 || 0;
        this.fragmentPercentage = (this.progress.fragmentsUnlocked / this.progress.totalFragments) * 100 || 0;
      },
      error => {
        console.error('Error loading progress:', error);
      }
    );
  }

  private loadUnlockedFragments(): void {
    this.challengeService.getUnlockedFragments().subscribe(fragments => {
      this.unlockedFragments = fragments;
    });
  }

  logout(): void {
    // Clear authentication tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('authToken');

    // Redirect to login page
    this.router.navigate(['']);
  }
}
