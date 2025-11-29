import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-sign',
  standalone: true,
  imports: [CommonModule],
  template: `<p>Processant autenticació...</p>`
})
export class SignComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const userId = params.get('user_id');
      const isNewUser = params.get('is_new_user');
      const next = params.get('next');

      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }
      if (userId) {
        localStorage.setItem('user_id', userId);
      }
      if (isNewUser) {
        localStorage.setItem('is_new_user', isNewUser);
      }
      console.log('Sign in successful!');
      console.log('Next:', next);
      // Redirect to dashboard
      this.router.navigate([next]);
    });
  }
}
