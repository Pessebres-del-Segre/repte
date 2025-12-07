import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl; // Fallback for dev

    constructor(private http: HttpClient) { }

    login(credentials: any): Observable<any> {
        // Ensure we send 'email' and 'password' as expected by the new backend serializer
        return this.http.post(`${this.apiUrl}/login/`, credentials).pipe(
            tap((response: any) => {
                if (response.access) {
                    this.setCookie('access_token', response.access, 1); // 1 day expiration
                    this.setCookie('refresh_token', response.refresh, 7); // 7 days expiration
                }
            })
        );
    }

    signup(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register/`, data).pipe(
            tap((response: any) => {
                if (response.access) {
                    this.setCookie('access_token', response.access, 1);
                    this.setCookie('refresh_token', response.refresh, 7);
                }
            })
        );
    }

    logout(): void {
        this.deleteCookie('access_token');
        this.deleteCookie('refresh_token');
    }

    isAuthenticated(): boolean {
        return !!this.getCookie('access_token');
    }

    getToken(): string | null {
        return localStorage.getItem('access_token');
    }

    // Helper methods for cookies
    private setCookie(name: string, value: string, days: number): void {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        localStorage.setItem(name, value);
    }

    private getCookie(name: string): string | null {
        return localStorage.getItem(name);
    }

    private deleteCookie(name: string): void {
        localStorage.removeItem(name);
    }
}
