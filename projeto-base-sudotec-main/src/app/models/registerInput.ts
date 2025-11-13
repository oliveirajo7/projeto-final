export interface RegisterInput {
    username: string;
    password: string;
    name: string;
    email?: string;
    phone?: string;
    department?: string;
    role?: string;
}

export interface RegisterResponse {
    message: string;
    userId: number;
    isAdmin: boolean;
}

