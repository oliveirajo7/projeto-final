export interface AuthModel {
    username: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    user: UserData;
}

export interface UserData {
    id: number;
    username: string;
    name: string;
    email?: string;
    phone?: string;
    department?: string;
    role?: string;
    isAdmin: boolean;
    token: string;
}

export interface RegisterInput {
    username: string;
    password: string;
    name: string;
    email?: string;
    phone?: string;
    department?: string;
    role?: string;
}

export interface UserProfile {
    id: number;
    username: string;
    name: string;
    email?: string;
    phone?: string;
    department?: string;
    role?: string;
    isAdmin: boolean;
    // SEM token aqui - usado apenas para dados do perfil
}