import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

// Singleton state for token refresh
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export function AuthInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const router = inject(Router);
  const http = inject(HttpClient);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 &&
          error.error?.code === 'token_not_valid' &&
          error.error?.messages?.[0]?.message === 'Token is expired') {
        return handle401Error(request, next, router, http);
      }
      return throwError(() => error);
    })
  );
}

function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  router: Router,
  http: HttpClient
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const refreshToken = localStorage.getItem('refresh_token');

    if (refreshToken) {
      return http.post<any>(`${environment.apiUrl}/token/refresh/`, { refresh: refreshToken }).pipe(
        switchMap((tokens: any) => {
          isRefreshing = false;

          // Store the new tokens
          localStorage.setItem('access_token', tokens.access);
          if (tokens.refresh) {
            localStorage.setItem('refresh_token', tokens.refresh);
          }

          refreshTokenSubject.next(tokens.access);

          // Clone the original request and replace the old header with the new one
          const clonedRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${tokens.access}`
            }
          });

          // Retry the request with the new token
          return next(clonedRequest);
        }),
        catchError((err) => {
          isRefreshing = false;

          // If refresh token is also expired, redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          router.navigate(['/']);

          return throwError(() => err);
        })
      );
    } else {
      // No refresh token available, redirect to login
      isRefreshing = false;
      localStorage.removeItem('access_token');
      router.navigate(['/']);
      return throwError(() => new Error('No refresh token available'));
    }
  } else {
    // If refresh is in progress, wait until new token is retrieved
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        const clonedRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next(clonedRequest);
      })
    );
  }
}
