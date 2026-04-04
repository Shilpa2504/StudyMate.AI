import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./auth/login/login').then(m => m.Login) },
  { path: 'signup', loadComponent: () => import('./auth/signup/signup').then(m => m.Signup) },
  { path: 'home', loadComponent: () => import('./home/home').then(m => m.Home), canActivate: [authGuard] },
  { path: 'my-documents', loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard), canActivate: [authGuard] },
  { path: 'ask', loadComponent: () => import('./ai-document/ai-document').then(m => m.AiDocument), canActivate: [authGuard] },
  { path: 'ask-existing/:id', loadComponent: () => import('./ask-existing/ask-existing').then(m => m.AskExisting), canActivate: [authGuard] },
  { path: 'history/:id', loadComponent: () => import('./history/history').then(m => m.History), canActivate: [authGuard] },
  { path: 'quiz/:id', loadComponent: () => import('./quiz/quiz').then(m => m.Quiz), canActivate: [authGuard] },
  { path: 'quiz-history/:id', loadComponent: () => import('./quiz-history/quiz-history').then(m => m.QuizHistory), canActivate: [authGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
