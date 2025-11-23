import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChallengeService } from '../services/challenge.service';
import { Store } from '../models/store.model';

@Component({
  selector: 'app-link-participation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './link-participation.component.html',
  styleUrl: './link-participation.component.css'
})
export class LinkParticipationComponent implements OnInit {
  bookId: string | null = null;
  storeId: number | null = null;
  store: Store | undefined;

  constructor(
    private route: ActivatedRoute,
    private challengeService: ChallengeService
  ) {}

  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('book_id');
    const storeIdParam = this.route.snapshot.paramMap.get('empresa_id');

    if (storeIdParam) {
      this.storeId = +storeIdParam;
      this.loadStoreData();
    }
  }

  loadStoreData(): void {
    if (this.storeId) {
      this.challengeService.getStores().subscribe(stores => {
        this.store = stores.find(store => store.id === this.storeId);
      });
    }
  }

  unlockQR(): void {
    if (this.storeId) {
      this.challengeService.unlockStore(this.storeId);
      // You might want to navigate to another page or show a success message here
    }
  }
}
