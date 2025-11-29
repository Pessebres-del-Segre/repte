import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Store } from '../models/store.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Get store by ID
  getStore(storeId: string): Observable<Store> {
    const accessToken = localStorage.getItem('access_token');
    return this.http.get<Store>(`${this.apiUrl}/stores/get/${storeId}/`).pipe(
      catchError(error => {
        console.error('Error fetching store:', error);
        return throwError(() => error);
      })
    );
  }

  // Verify store with secret key
  verifyStore(storeId: string, secretKey: string): Observable<Store> {
    const accessToken = localStorage.getItem('access_token');
    return this.http.post<Store>(`${this.apiUrl}/store/verify/`, {
      store_id: storeId,
      secret_key: secretKey
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(
      catchError(error => {
        console.error('Error verifying store:', error);
        return throwError(() => error);
      })
    );
  }

  // Update store
  updateStore(storeId: string, storeData: Partial<Store>): Observable<Store> {
    const accessToken = localStorage.getItem('access_token');
    return this.http.patch<Store>(`${this.apiUrl}/stores/update/${storeId}/`, storeData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(
      catchError(error => {
        console.error('Error updating store:', error);
        return throwError(() => error);
      })
    );
  }

  // Upload store image
  uploadStoreImage(storeId: string, image: File): Observable<any> {
    const accessToken = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('image', image);

    return this.http.post<any>(`${this.apiUrl}/store/${storeId}/image/`, formData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(
      catchError(error => {
        console.error('Error uploading image:', error);
        return throwError(() => error);
      })
    );
  }

  // Get all stores (for store selection)
  getAllStores(): Observable<Store[]> {
    const accessToken = localStorage.getItem('access_token');
    return this.http.get<Store[]>(`${this.apiUrl}/stores/all/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(
      catchError(error => {
        console.error('Error fetching stores:', error);
        return throwError(() => error);
      })
    );
  }
}
