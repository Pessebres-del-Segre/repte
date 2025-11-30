import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ChallengeService} from '../services/challenge.service';
import {Store, StoreScanCollaboration} from '../models/store.model';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {LoginDialogComponent} from '../account/login-dialog/login-dialog.component';
import {StoreService} from '../services/store.service';
import {TutorialComponent} from '../tutorial/tutorial.component';

@Component({
  selector: 'app-link-participation',
  standalone: true,
  imports: [CommonModule, RouterLink, MatDialogModule, TutorialComponent],
  templateUrl: './link-participation.component.html',
  styleUrl: './link-participation.component.css'
})
export class LinkParticipationComponent implements OnInit {
  bookId: string | null = null;
  storeId: string | null = null;
  store: Store | undefined;
  storeCollaboration: StoreScanCollaboration | undefined;
  mustLink: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private challengeService: ChallengeService,
    private storeService: StoreService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('book_id');
    const storeIdParam = this.route.snapshot.paramMap.get('empresa_id');
    console.log(storeIdParam);
    this.storeId = storeIdParam;
    this.mustLink = this.route.snapshot.paramMap.get('must_link') === 'true';
    this.loadStoreData();
  }

  loadStoreData(): void {
    if (this.storeId) {
      this.storeService.getStore(this.storeId).subscribe(store => {
        this.store = store;
      })
      this.challengeService.getStoreCollaborationScan(this.storeId).subscribe(store => {
        this.storeCollaboration = store;
        if (this.storeCollaboration?.is_scanned) {
          /* Sleep 2 segonds */
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000)
        }
      });
    }

  }

  unlockQR(): void {
    // Check if user is authenticated
    const isAuthenticated = !!localStorage.getItem('access_token');

    if (!isAuthenticated) {
      // Open login dialog if not authenticated
      const currentUrl = `/link/${this.bookId}/${this.storeId}`;
      const dialogRef = this.dialog.open(LoginDialogComponent, {
        width: '500px',
        data: {returnUrl: currentUrl, mustLink: true}
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
        // Check if user is now authenticated after dialog is closed
        if (localStorage.getItem('access_token')) {
          // If authenticated, try to unlock the QR again
          this.unlockQR();
        }
      });
      return;
    }

    // If authenticated, proceed with unlocking the QR
    if (this.storeId) {
      this.challengeService.unlockStore(this.storeId).subscribe(
        response => {
          console.log('Unlock response:', response);
          if (response.error) {
            // Handle error (409 or other)
            console.error('Error unlocking store:', response.error);
            // Refresh
            this.loadStoreData();
            // You can show an error message to the user here
          } else {
            // Success - refresh store data
            this.loadStoreData();
            this.router.navigate(['/dashboard']);
          }
        }
      );
    }
  }
}
