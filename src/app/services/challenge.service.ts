import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Store } from '../models/store.model';
import { Fragment } from '../models/fragment.model';
import { environment } from '../../environments/environment';

interface ProgressResponse {
  scans_count: number;
  collaborations_count: number;
  missing_final_scans: number;
  discovered_fragments: number;
  len_fragments: number;
}

interface EntityLinkStatus {
  name_entity: string;
  scanned: boolean;
}

interface EntityLinkStatusResponse {
  collaboration_scanned: EntityLinkStatus[];
}

interface FragmentsResponse {
  fragments: Fragment[];
  discovered_fragments: number;
  len_fragments: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private apiUrl = environment.apiUrl;
  // Mock data for stores
  private stores: Store[] = [
  ];

  // Mock data for fragments
  private fragments: Fragment[] = [
  ];

  private storesSubject = new BehaviorSubject<Store[]>(this.stores);
  private fragmentsSubject = new BehaviorSubject<Fragment[]>(this.fragments);

  constructor(private http: HttpClient) { }

  // Get progress data from API
  getProgressFromApi(userId: number = 1): Observable<ProgressResponse> {
    const accessToken = localStorage.getItem('access_token');
    return this.http.get<ProgressResponse>(`${this.apiUrl}/progress/${userId}/`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }).pipe(
      catchError(error => {
        console.error('Error fetching progress data:', error);
        // Return a default response in case of error
        return of({
          scans_count: 0,
          collaborations_count: 0,
          missing_final_scans: 0,
          discovered_fragments: 0,
          len_fragments: 0
        });
      })
    );
  }

  // Get all stores
  getStores(): Observable<Store[]> {
    return this.storesSubject.asObservable();
  }

  // Get all fragments
  getFragments(): Observable<Fragment[]> {
    return this.fragmentsSubject.asObservable();
  }

  // Get unlocked fragments
  getUnlockedFragments(): Observable<Fragment[]> {
    const unlockedFragments = this.fragments;
    return new BehaviorSubject<Fragment[]>(unlockedFragments).asObservable();
  }


  // Unlock a store by ID
  unlockStore(storeId: number): void {

  }

  // Get challenge progress
  getChallengeProgress(challengeId: number = 1): Observable<{ storesUnlocked: number, totalStores: number, fragmentsUnlocked: number, totalFragments: number }> {
    return this.getProgressFromApi(challengeId).pipe(
      map(response => ({
        storesUnlocked: response.scans_count,
        totalStores: response.collaborations_count,
        fragmentsUnlocked: response.discovered_fragments,
        totalFragments: response.len_fragments
      }))
    );
  }

  // Get all entities with their scan status
  getEntitiesLinkStatus(contestId: number = 1): Observable<EntityLinkStatusResponse> {
    const accessToken = localStorage.getItem('access_token');
    return this.http.get<EntityLinkStatusResponse>(`${this.apiUrl}/entities_link_status/${contestId}/`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }).pipe(
      catchError(error => {
        console.error('Error fetching entities link status:', error);
        // Return a default response in case of error
        return of({
          collaboration_scanned: []
        });
      })
    );
  }

  // Get story fragments from API
  getStoryFragments(contestId: number = 1): Observable<FragmentsResponse> {
    const accessToken = localStorage.getItem('access_token');
    return this.http.get<FragmentsResponse>(`${this.apiUrl}/fragments/${contestId}/`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }).pipe(
      catchError(error => {
        console.error('Error fetching story fragments:', error);
        // Return a default response in case of error
        return of({
          fragments: [],
          discovered_fragments: 0,
          len_fragments: 0
        });
      })
    );
  }
}
