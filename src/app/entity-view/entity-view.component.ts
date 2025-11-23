import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChallengeService } from '../services/challenge.service';

@Component({
  selector: 'app-entity-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './entity-view.component.html',
  styleUrls: ['./entity-view.component.css']
})
export class EntityViewComponent implements OnInit {
  entities: { name_entity: string; scanned: boolean }[] = [];
  loading = true;
  error = false;

  constructor(private challengeService: ChallengeService) { }

  ngOnInit(): void {
    this.loadEntities();
  }

  loadEntities(): void {
    this.loading = true;
    this.error = false;

    this.challengeService.getEntitiesLinkStatus().subscribe({
      next: (response) => {
        this.entities = response.collaboration_scanned;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading entities:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }
}
