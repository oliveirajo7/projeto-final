import { Routes } from '@angular/router';
import { Login } from './app/pages/auth/login/login';
import { Register } from './app/pages/auth/register/register';
import { Home } from './app/pages/home/home';
import { AuthGuard } from './app/guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { 
        path: 'home', 
        component: Home,
        canActivate: [AuthGuard] // Se tiver guard de autenticação
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];