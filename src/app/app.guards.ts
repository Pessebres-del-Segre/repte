import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Aquí hauries de comprovar l'estat d'autenticació real
    // Per exemple, comprovant un token al localStorage o un servei d'auth
    const isLoggedIn = this.isUserLoggedIn();
    console.log('isLoggedIn', isLoggedIn);
    if (!isLoggedIn) {
      this.router.navigate(['']);
      return false;
    }

    return true;
  }

  private isUserLoggedIn(): boolean {
    // Implementa la teva lògica d'autenticació aquí
    // Exemple amb localStorage:
    return !!localStorage.getItem('access_token');

    // O si tens un servei d'autenticació:
    // return this.authService.isAuthenticated();
  }
}


@Injectable({
  providedIn: 'root'
})
export class RedirectIfAuthenticatedGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = this.isUserLoggedIn();

    if (isLoggedIn) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }

  private isUserLoggedIn(): boolean {
    // La mateixa lògica que l'AuthGuard
    return !!localStorage.getItem('authToken');
  }
}
