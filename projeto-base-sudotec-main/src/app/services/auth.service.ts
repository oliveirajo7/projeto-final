import { Injectable } from '@angular/core';
import { UserData } from '@/models/auth.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'user_data';

    /**
     * Salva o token e os dados do usuário no localStorage
     */
    saveAuthData(userData: UserData): void {
        console.log('💾 Salvando dados de autenticação:', userData);
        
        localStorage.setItem(this.TOKEN_KEY, userData.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
        
        // Verificar se salvou corretamente
        const savedToken = localStorage.getItem(this.TOKEN_KEY);
        const savedUser = localStorage.getItem(this.USER_KEY);
        console.log('✅ Dados salvos - Token:', !!savedToken, 'User:', !!savedUser);
    }

    /**
     * Retorna o token de autenticação
     */
    getToken(): string | null {
        const token = localStorage.getItem(this.TOKEN_KEY);
        console.log('🔑 Token recuperado:', token ? 'EXISTE' : 'NÃO EXISTE');
        return token;
    }

    /**
     * Retorna os dados do usuário logado
     */
    getUserData(): UserData | null {
        const userData = localStorage.getItem(this.USER_KEY);
        if (userData) {
            const parsed = JSON.parse(userData);
            console.log('👤 Dados do usuário recuperados:', parsed);
            return parsed;
        }
        console.log('👤 Nenhum dado de usuário encontrado');
        return null;
    }

    /**
     * Verifica se o usuário está autenticado
     */
    isAuthenticated(): boolean {
        const token = this.getToken();
        const isAuth = token !== null;
        console.log('🔐 Usuário autenticado:', isAuth);
        return isAuth;
    }

    /**
     * Verifica se o usuário é admin
     */
    isAdmin(): boolean {
        const userData = this.getUserData();
        const isAdmin = userData?.isAdmin || false;
        console.log('👑 É admin:', isAdmin);
        return isAdmin;
    }

    /**
     * Remove os dados de autenticação (logout)
     */
    logout(): void {
        console.log('🚪 Fazendo logout...');
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        console.log('✅ Logout realizado');
    }
}