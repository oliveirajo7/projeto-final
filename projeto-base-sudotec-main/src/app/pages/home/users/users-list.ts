import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { UserService } from '@/services/user.service';
import { AuthService } from '@/services/auth.service';
import { UserProfile } from '@/models/auth.model';

@Component({
    selector: 'app-users-list',
    standalone: true,
    imports: [
        CommonModule, 
        RouterModule, 
        ButtonModule, 
        TableModule, 
        TagModule, 
        ToolbarModule,
        ConfirmDialogModule,
        Toast
    ],
    templateUrl: './users-list.html',
    providers: [MessageService, ConfirmationService]
})
export class UsersList implements OnInit {
    private userService = inject(UserService);
    private authService = inject(AuthService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    users: UserProfile[] = [];
    loading = true;
    currentUserId = 0;

    ngOnInit() {
        this.currentUserId = this.authService.getUserData()?.id || 0;
        this.loadUsers();
    }

    loadUsers() {
        this.loading = true;
        this.userService.getUsers().subscribe({
            next: (users: UserProfile[]) => {
                this.users = users;
                this.loading = false;
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar usuários: ' + (err.error?.error || 'Erro desconhecido')
                });
                this.loading = false;
            }
        });
    }

    // MÉTODOS NOVOS PARA O TEMPLATE
    getAdminLabel(isAdmin: boolean): string {
        return isAdmin ? 'Administrador' : 'Usuário';
    }

    getSeverity(isAdmin: boolean): string {
        return isAdmin ? 'danger' : 'info';
    }

    confirmDelete(user: UserProfile) {
        this.confirmationService.confirm({
            message: `Tem certeza que deseja deletar o usuário <strong>${user.username}</strong>? Esta ação não pode ser desfeita.`,
            header: 'Confirmar Exclusão',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => {
                this.deleteUser(user.id);
            }
        });
    }

    deleteUser(userId: number) {
        this.userService.deleteUser(userId).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Usuário deletado com sucesso'
                });
                this.loadUsers(); // Recarregar a lista
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao deletar usuário: ' + (err.error?.error || 'Erro desconhecido')
                });
            }
        });
    }

    toggleAdmin(user: UserProfile) {
        const newAdminStatus = !user.isAdmin;
        const action = newAdminStatus ? 'tornar administrador' : 'remover administrador';
        
        this.confirmationService.confirm({
            message: `Tem certeza que deseja ${action} o usuário <strong>${user.username}</strong>?`,
            header: 'Confirmar Alteração',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: newAdminStatus ? 'p-button-success' : 'p-button-warning',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => {
                this.updateUserAdmin(user.id, newAdminStatus);
            }
        });
    }

    updateUserAdmin(userId: number, isAdmin: boolean) {
        this.userService.updateUserAdmin(userId, isAdmin).subscribe({
            next: (updatedUser) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: `Usuário ${updatedUser.username} ${isAdmin ? 'tornou-se administrador' : 'foi removido dos administradores'}`
                });
                this.loadUsers(); // Recarregar a lista para refletir mudanças
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao atualizar usuário: ' + (err.error?.error || 'Erro desconhecido')
                });
            }
        });
    }

    isCurrentUser(userId: number): boolean {
        return userId === this.currentUserId;
    }
}