import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthModel, LoginResponse, UserData } from '@/models/auth.model';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private loginApi: string = 'http://localhost:3000/auth';
    private http = inject(HttpClient);

    login(loginInput: AuthModel): Observable<UserData> {
        console.log('🔐 Enviando login para:', this.loginApi + '/login');
        console.log('📝 Credenciais recebidas:', { 
            username: loginInput.username, 
            password: '***' 
        });

        // Limpar e preparar as credenciais
        const username = loginInput.username.trim();
        const password = loginInput.password;

        console.log('🧹 Credenciais limpas:', { username, password: '***' });

        // Criar token Basic Auth manualmente
        const token = btoa(`${username}:${password}`);
        console.log('🔑 Token Basic Auth gerado:', token);

        // Fazer a requisição com o body vazio e headers de autenticação
        return this.http.post<LoginResponse>(
            `${this.loginApi}/login`, 
            {}, // Body vazio
            {
                headers: {
                    'Authorization': `Basic ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        ).pipe(
            map(response => {
                console.log('✅ Login bem-sucedido:', response);
                return response.user;
            })
        );
    }
}