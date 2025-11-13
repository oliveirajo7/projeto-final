import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserData, UserProfile } from '@/models/auth.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl: string = 'http://localhost:3000/users';
    private http = inject(HttpClient);

    /**
     * Busca o perfil do usuário logado
     */
    getMyProfile(): Observable<UserProfile> {
        return this.http.get<UserProfile>(`${this.apiUrl}/me`);
    }

    /**
     * Atualiza o perfil do usuário logado
     */
    updateMyProfile(profileData: Partial<UserProfile>): Observable<{message: string, user: UserProfile}> {
        return this.http.put<{message: string, user: UserProfile}>(`${this.apiUrl}/me`, profileData);
    }

    /**
     * Lista todos os usuários (apenas admin)
     */
    getUsers(): Observable<UserProfile[]> {  // Mudado para UserProfile[]
        return this.http.get<UserProfile[]>(this.apiUrl);
    }

    /**
     * Busca um usuário por ID (apenas admin)
     */
    getUserById(id: number): Observable<UserProfile> {
        return this.http.get<UserProfile>(`${this.apiUrl}/${id}`);
    }

    /**
     * Deleta um usuário (apenas admin)
     */
    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    /**
     * Atualiza status de admin de um usuário (apenas admin)
     */
    updateUserAdmin(id: number, isAdmin: boolean): Observable<UserProfile> {
        return this.http.patch<UserProfile>(`${this.apiUrl}/${id}/admin`, { isAdmin });
    }
}