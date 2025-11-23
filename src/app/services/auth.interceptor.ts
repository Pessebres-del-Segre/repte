import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private router: Router, private http: HttpClient) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 &&
            error.error?.code === 'token_not_valid' &&
            error.error?.messages?.[0]?.message === 'Token is expired') {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        return this.http.post<any>(`${environment.apiUrl}/token/refresh/`, { refresh: refreshToken }).pipe(
          switchMap((tokens: any) => {
            this.isRefreshing = false;

            // Store the new tokens
            localStorage.setItem('access_token', tokens.access);
            if (tokens.refresh) {
              localStorage.setItem('refresh_token', tokens.refresh);
            }

            this.refreshTokenSubject.next(tokens.access);

            // Clone the original request and replace the old header with the new one
            const clonedRequest = request.clone({
              setHeaders: {
                Authorization: `Bearer ${tokens.access}`
              }
            });

            // Retry the request with the new token
            return next.handle(clonedRequest);
          }),
          catchError((err) => {
            this.isRefreshing = false;

            // If refresh token is also expired, redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            this.router.navigate(['/']);

            return throwError(() => err);
          })
        );
      } else {
        // No refresh token available, redirect to login
        this.isRefreshing = false;
        localStorage.removeItem('access_token');
        this.router.navigate(['/']);
        return throwError(() => new Error('No refresh token available'));
      }
    } else {
      // If refresh is in progress, wait until new token is retrieved
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => {
          const clonedRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next.handle(clonedRequest);
        })
      );
    }
  }
}
