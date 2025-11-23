import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-google-callback',
  template: `<p>Iniciant sessió amb Google...</p>`
})
export class GoogleCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const access = params.get('access');
      const refresh = params.get('refresh');

      if (access) {
        // Guardas el token donde lo gestiones normalmente
        localStorage.setItem('access_token', access);
      }
      if (refresh) {
        localStorage.setItem('refresh_token', refresh);
      }

      // Redirigir a donde quieras (inicio, mapa del Repte, etc.)
      this.router.navigate(['/']);
    });
  }
}
