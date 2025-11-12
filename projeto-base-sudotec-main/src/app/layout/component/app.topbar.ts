import { Component, inject, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { Menu } from 'primeng/menu';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { AuthService } from '@/services/auth.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, Menu],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <img src="assets/logo-capsa-desk.png" alt="Capsa Desk" class="h-10">
                <span>CAPSA DESK</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <app-configurator />
            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action" (click)="userMenu.toggle($event)">
                        <i class="pi pi-user"></i>
                    </button>
                    <p-menu #userMenu [model]="userMenuItems" [popup]="true" [style]="{ width: '200px' }"></p-menu>
                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar {
    @ViewChild('userMenu') userMenu!: Menu;

    layoutService = inject(LayoutService);
    authService = inject(AuthService);
    router = inject(Router);

    userMenuItems: MenuItem[] = [];

    constructor() {
        this.initializeUserMenu();
    }

    get currentUser() {
        return this.authService.getUserData();
    }

    initializeUserMenu() {
        this.userMenuItems = [
            {
                label: 'Nome: ' + (this.currentUser?.username || 'Usuário'),
                items: [
                    {
                        label: 'Perfil',
                        icon: 'pi pi-user',
                        command: () => {
                            console.log('Ir para perfil');
                        }
                    },
                    {
                        separator: true
                    },
                    {
                        label: 'Sair',
                        icon: 'pi pi-sign-out',
                        command: () => {
                            this.logout();
                        }
                    }
                ]
            }
        ];
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
}