import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BookViewComponent } from './book/book-view/book-view.component';
import {LinkParticipationComponent} from './link-participation/link-participation.component';
import {GoogleCallbackComponent} from './auth/google-callback/google-callback.component';
import {SignComponent} from './auth/sign/sign.component';
import {EntityViewComponent} from './entity-view/entity-view.component';
import {AuthGuard, RedirectIfAuthenticatedGuard} from './app.guards';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent, canActivate: [RedirectIfAuthenticatedGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'all-stores', component: EntityViewComponent, canActivate: [AuthGuard] },
  { path: 'book/:id', component: BookViewComponent },
  { path: 'link/:book_id/:empresa_id', component: LinkParticipationComponent},
  { path: 'auth/google/callback', component: GoogleCallbackComponent },
  { path: 'sign', component: SignComponent },
];
