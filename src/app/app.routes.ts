import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LeaderListComponent } from './pages/leader-list/leader-list';
import { LeaderFormComponent } from './pages/leader-form/leader-form';
import { NotFoundComponent } from './pages/not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'Gym Leader Registry - Home' },
  { path: 'leaders', component: LeaderListComponent, title: 'Gym Leader Registry - Leader List' },
  { path: 'leaders/new', component: LeaderFormComponent, title: 'Gym Leader Registry - Add Leader' },
  { path: 'leaders/:id/edit', component: LeaderFormComponent, title: 'Gym Leader Registry - Edit Leader' },
  { path: '**', component: NotFoundComponent, title: 'Gym Leader Registry - 404 Not Found' }
];