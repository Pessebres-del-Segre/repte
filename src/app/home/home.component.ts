import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { LoginDialogComponent } from '../account/login-dialog/login-dialog.component';
import {TutorialComponent} from '../tutorial/tutorial.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatDialogModule, TutorialComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private dialog: MatDialog) { }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '500px',
      data: { returnUrl: '/dashboard', mustLink: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      // Handle login/signup result here
    });
  }
}
