import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';

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

                <div *ngIf="!isLoading" class="space-y-4 max-w-4xl">
                    <!-- Profile Card -->
                    <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
                        <div class="flex items-center gap-4">
                            <div class="w-16 h-16 bg-fuchsia-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                                {{ userInitial }}
                            </div>
                            <div>
                                <h2 class="text-xl font-semibold text-surface-900 dark:text-surface-0">{{ user.username || 'Usuário' }}</h2>
                                <p class="text-surface-600 dark:text-surface-400 text-sm">{{ user.role || 'Usuário' }} - {{ user.department || 'Não definido' }}</p>
                                <p class="text-surface-500 dark:text-surface-500 text-xs mt-1" *ngIf="user.joinedDate">Membro desde {{ user.joinedDate }}</p>
                                <p class="text-surface-500 dark:text-surface-500 text-xs">
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
                            
                            <div class="space-y-1 md:col-span-2">
                                <label class="block text-xs font-medium text-surface-700 dark:text-surface-300">Biografia</label>
                                <div class="w-full px-3 py-2 bg-surface-100 dark:bg-surface-800 rounded text-surface-900 dark:text-surface-0 border-none min-h-[60px] text-sm">
                                    {{ user.bio || 'Nenhuma biografia informada' }}
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

    isLoading = true;
    userInitial = 'U';
    
    user = {
        id: 0,
        name: '',
        email: '',
        phone: '',
        department: '',
        role: '',
        bio: '',
        joinedDate: '',
        username: '',
        isAdmin: false
    };

    ngOnInit() {
        this.loadUserProfile();
    }

    loadUserProfile() {
        this.isLoading = true;
        
        // Simula carregamento dos dados do usuário
        setTimeout(() => {
            const authUser = this.authService.getUserData();
            
            if (authUser) {
                this.user = {
                    id: authUser.id,
                    username: authUser.username,
                    name: authUser.username,
                    email: 'usuario@exemplo.com',
                    phone: '(11) 99999-9999',
                    department: 'Desenvolvimento',
                    role: 'Desenvolvedor',
                    bio: 'Usuário do sistema Capsa Desk',
                    joinedDate: new Date().toLocaleDateString('pt-BR'),
                    isAdmin: authUser.isAdmin
                };
                
                this.userInitial = this.user.username.charAt(0).toUpperCase();
            }
            
            this.isLoading = false;
        }, 800);
    }
}