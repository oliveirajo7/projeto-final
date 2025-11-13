import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { LoginService } from '@/services/login-service';
import { AuthModel } from '@/models/auth.model';
import { AuthService } from '@/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, ReactiveFormsModule, RouterModule, RippleModule, Toast],
    templateUrl: './login.html',
    providers: [MessageService, LoginService]
})
export class Login {
    formBuilder = inject(FormBuilder);
    messageService = inject(MessageService);
    loginService = inject(LoginService);
    authService = inject(AuthService);
    router = inject(Router);

    isLoading = false;

    loginForm = this.formBuilder.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]]
    });

    validarLogin() {
        if (this.loginForm.invalid) {
            this.messageService.add({ 
                severity: 'warn', 
                summary: 'Atenção', 
                detail: 'Preencha todos os campos corretamente' 
            });
            return;
        }

        let loginInput = this.loginForm.value as AuthModel;

        console.log('🔐 Tentando logar com:', loginInput);

        this.isLoading = true;

        this.loginService.login(loginInput).subscribe({
            next: (userData) => {
                console.log('✅ Login bem-sucedido, dados recebidos:', userData);
                
                // Verificar se os dados estão completos
                if (!userData || !userData.token) {
                    console.error('❌ Dados do usuário incompletos:', userData);
                    this.messageService.add({ 
                        severity: 'error', 
                        summary: 'Erro', 
                        detail: 'Dados de autenticação incompletos' 
                    });
                    return;
                }

                // Salvar dados no AuthService
                this.authService.saveAuthData(userData);
                
                // Verificar se os dados foram salvos corretamente
                const savedData = this.authService.getUserData();
                console.log('💾 Dados salvos no localStorage:', savedData);
                
                this.messageService.add({ 
                    severity: 'success', 
                    summary: 'Login realizado', 
                    detail: `Bem-vindo, ${userData.name || userData.username}!` 
                });
                
                // Navegar para home
                setTimeout(() => {
                    this.router.navigate(['/home']);
                }, 1000);
            },
            error: (err) => {
                console.error('❌ Erro no login:', err);
                this.isLoading = false;
                
                const errorMessage = err.error?.error || err.message || 'Erro ao realizar login';
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Erro de Login', 
                    detail: errorMessage 
                });
            },
            complete: () => {
                this.isLoading = false;
                console.log('✅ Login process completo');
            }
        });
    }
}