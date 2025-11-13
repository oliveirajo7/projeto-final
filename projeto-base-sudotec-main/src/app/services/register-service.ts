import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterInput } from '@/models/registerInput';

@Injectable({
    providedIn: 'root'
})
export class RegisterService {
    private registerApi: string = 'http://localhost:3000/auth';
    private http = inject(HttpClient);

    register(registerInput: RegisterInput): Observable<any> {
        console.log('Enviando cadastro para:', this.registerApi + '/register');
        console.log('Dados do cadastro:', registerInput);
        
        return this.http.post(this.registerApi + '/register', registerInput, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}