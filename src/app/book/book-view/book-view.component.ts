import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ChallengeService } from '../../services/challenge.service';
import { Store } from '../../models/store.model';
import { Fragment } from '../../models/fragment.model';

@Component({
  selector: 'app-book-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-view.component.html',
  styleUrl: './book-view.component.css'
})
export class BookViewComponent implements OnInit {
  fragments: Fragment[] = [];
  currentFragmentIndex: number = 0;
  currentFragment: Fragment | undefined;
  totalFragmentsInStory: number = 0;
  discoveredFragments: number = 0;
  zoomSrc: string | null = null;
  syntheticFragment: Fragment = {
    id: -1,
    title: "Vols descobrir com acaba la història?",
    text: "Desbloqueja els QRs de les botigues que et falten!",
    order: -1,
    is_final: false
  };

  constructor(
    private challengeService: ChallengeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      const contestId = params['id'];
      if (contestId) {
        this.loadFragmentsFromApi(contestId);
      } else {
        // Fallback to mock data if no contest ID is provided
        this.loadFragments();
      }
    });
  }

  private loadFragments(): void {
    this.challengeService.getFragments().subscribe(fragments => {
      this.fragments = fragments.sort((a, b) => a.order - b.order);
      if (this.fragments.length > 0) {
        this.setCurrentFragment(0);
      }
    });
  }

  private loadFragmentsFromApi(contestId: number): void {
    this.challengeService.getStoryFragments(contestId).subscribe(response => {
      // Map API fragments to our Fragment model and ensure they're marked as unlocked
      this.fragments = response.fragments.map(fragment => ({
        ...fragment,
        content: fragment.text, // For backward compatibility
        isUnlocked: true // All fragments from API are considered unlocked
      })).sort((a, b) => a.order - b.order);

      // Store total and discovered fragments for later use
      this.totalFragmentsInStory = response.len_fragments;
      this.discoveredFragments = response.discovered_fragments;

      if (this.fragments.length > 0) {
        this.setCurrentFragment(0);
      }
    });
  }

  setCurrentFragment(index: number): void {
    if (index >= 0 && index < this.fragments.length) {
      this.currentFragmentIndex = index;
      this.currentFragment = this.fragments[index];
    }
  }

  nextFragment(): void {
    // If we're at the last available fragment but not all fragments are discovered
    if (this.currentFragmentIndex === this.fragments.length - 1 && this.discoveredFragments < this.totalFragmentsInStory) {
      // Show synthetic fragment
      this.currentFragment = this.syntheticFragment;
      this.currentFragmentIndex = this.fragments.length; // Set to a value beyond the array
      return;
    }

    // If we're at the synthetic fragment, do nothing (can't go further)
    if (this.currentFragment === this.syntheticFragment) {
      return;
    }

    // Normal navigation to next fragment
    if (this.currentFragmentIndex < this.fragments.length - 1) {
      const nextIndex = this.currentFragmentIndex + 1;
      this.setCurrentFragment(nextIndex);
    }
  }

  previousFragment(): void {
    // If we're at the synthetic fragment, go back to the last real fragment
    if (this.currentFragment === this.syntheticFragment) {
      this.setCurrentFragment(this.fragments.length - 1);
      return;
    }

    // Normal navigation to previous fragment
    if (this.currentFragmentIndex > 0) {
      this.setCurrentFragment(this.currentFragmentIndex - 1);
    }
  }

  // Check if we can navigate to the next fragment
  canNavigateNext(): boolean {
    // If we're at the synthetic fragment, we can't go further
    if (this.currentFragment === this.syntheticFragment) {
      return false;
    }

    // If we're at the last fragment and have all fragments, we can't go further
    if (this.currentFragmentIndex === this.fragments.length - 1 && this.discoveredFragments === this.totalFragmentsInStory) {
      return false;
    }

    // Otherwise, we can navigate if there's a next fragment or if we're at the last available fragment but not all fragments are discovered
    return this.currentFragmentIndex < this.fragments.length - 1 ||
           (this.currentFragmentIndex === this.fragments.length - 1 && this.discoveredFragments < this.totalFragmentsInStory);
  }

  // Image zoom functionality
  openZoom(src: string): void {
    this.zoomSrc = src;
  }

  closeZoom(): void {
    this.zoomSrc = null;
  }
}
