import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@/services/auth.service';
import { UserService } from '@/services/user.service';
import { UserProfile } from '@/models/auth.model';

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule],
    template: `
        <div class="col-span-12">
            <div class="p-4 bg-surface-50 dark:bg-surface-950">

                <!-- Loading State -->
                <div *ngIf="isLoading" class="flex justify-center items-center py-10">
                    <div class="text-center">
                        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-fuchsia-500 mx-auto mb-3"></div>
                        <p class="text-surface-600 dark:text-surface-400 text-sm">Carregando perfil...</p>
                    </div>
                </div>

                <!-- Error State -->
                <div *ngIf="error && !isLoading" class="flex justify-center items-center py-10">
                    <div class="text-center">
                        <div class="text-red-500 text-lg mb-2">⚠️</div>
                        <p class="text-surface-600 dark:text-surface-400 text-sm">{{ error }}</p>
                        <button (click)="loadUserProfile()" 
                                class="mt-3 px-4 py-2 bg-fuchsia-500 text-white rounded hover:bg-fuchsia-600 text-sm">
                            Tentar Novamente
                        </button>
                    </div>
                </div>

                <div *ngIf="!isLoading && !error" class="space-y-4 max-w-4xl">
                    <!-- Profile Card -->
                    <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
                        <div class="flex items-center gap-4">
                            <div class="w-16 h-16 bg-fuchsia-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                                {{ userInitial }}
                            </div>
                            <div>
                                <h2 class="text-xl font-semibold text-surface-900 dark:text-surface-0">{{ user.name || user.username }}</h2>
                                <p class="text-surface-600 dark:text-surface-400 text-sm">
                                    {{ user.role || 'Usuário' }} 
                                    <span *ngIf="user.department">- {{ user.department }}</span>
                                </p>
                                <p class="text-surface-500 dark:text-surface-500 text-xs mt-1">
                                    {{ user.isAdmin ? 'Administrador' : 'Usuário' }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Informações Pessoais -->
                    <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
                        <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-0 mb-4">Informações Pessoais</h3>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-1">
                                <label class="block text-xs font-medium text-surface-700 dark:text-surface-300">Nome Completo</label>
                                <div class="w-full px-3 py-2 bg-surface-100 dark:bg-surface-800 rounded text-surface-900 dark:text-surface-0 border-none text-sm">
                                    {{ user.name || 'Não informado' }}
                                </div>
                            </div>
                            
                            <div class="space-y-1">
                                <label class="block text-xs font-medium text-surface-700 dark:text-surface-300">Username</label>
                                <div class="w-full px-3 py-2 bg-surface-100 dark:bg-surface-800 rounded text-surface-900 dark:text-surface-0 border-none text-sm">
                                    {{ user.username || 'Não informado' }}
                                </div>
                            </div>
                            
                            <div class="space-y-1">
                                <label class="block text-xs font-medium text-surface-700 dark:text-surface-300">Email</label>
                                <div class="w-full px-3 py-2 bg-surface-100 dark:bg-surface-800 rounded text-surface-900 dark:text-surface-0 border-none text-sm">
                                    {{ user.email || 'Não informado' }}
                                </div>
                            </div>
                            
                            <div class="space-y-1">
                                <label class="block text-xs font-medium text-surface-700 dark:text-surface-300">Telefone</label>
                                <div class="w-full px-3 py-2 bg-surface-100 dark:bg-surface-800 rounded text-surface-900 dark:text-surface-0 border-none text-sm">
                                    {{ user.phone || 'Não informado' }}
                                </div>
                            </div>
                            
                            <div class="space-y-1">
                                <label class="block text-xs font-medium text-surface-700 dark:text-surface-300">Departamento</label>
                                <div class="w-full px-3 py-2 bg-surface-100 dark:bg-surface-800 rounded text-surface-900 dark:text-surface-0 border-none text-sm">
                                    {{ user.department || 'Não informado' }}
                                </div>
                            </div>
                            
                            <div class="space-y-1">
                                <label class="block text-xs font-medium text-surface-700 dark:text-surface-300">Cargo</label>
                                <div class="w-full px-3 py-2 bg-surface-100 dark:bg-surface-800 rounded text-surface-900 dark:text-surface-0 border-none text-sm">
                                    {{ user.role || 'Não informado' }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class StatsWidget implements OnInit {
    private authService = inject(AuthService);
    private userService = inject(UserService);

    isLoading = true;
    error = '';
    userInitial = 'U';
    
    user: UserProfile = {
        id: 0,
        username: '',
        name: '',
        email: '',
        phone: '',
        department: '',
        role: '',
        isAdmin: false
    };

    ngOnInit() {
        this.loadUserProfile();
    }

    loadUserProfile() {
        this.isLoading = true;
        this.error = '';
        
        this.userService.getMyProfile().subscribe({
            next: (userData) => {
                this.user = userData;
                this.userInitial = (userData.name || userData.username).charAt(0).toUpperCase();
                this.isLoading = false;
            },
            error: (err) => {
                this.error = err.error?.error || 'Erro ao carregar perfil';
                this.isLoading = false;
                console.error('Erro ao carregar perfil:', err);
            }
        });
    }
}