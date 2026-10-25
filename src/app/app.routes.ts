import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LeaderList } from './pages/leader-list/leader-list';
import { LeaderForm } from './pages/leader-form/leader-form';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'Gym Leader Registry - Home' },
  { path: 'leaders', component: LeaderList, title: 'Gym Leader Registry - Leader List' },
  { path: 'leaders/new', component: LeaderForm, title: 'Gym Leader Registry - Add Leader' },
  { path: 'leaders/:id/edit', component: LeaderForm, title: 'Gym Leader Registry - Edit Leader' },
  { path: '**', component: NotFound, title: 'Gym Leader Registry - 404 Not Found' }
];