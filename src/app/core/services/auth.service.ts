import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthModel, DataRequestModel } from "../models/namana.model";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(
        private router: Router,
        private http: HttpClient
    ) {}

    logIn(data: AuthModel): Observable<any> {
        const donnees: DataRequestModel = {
            model: 'text-davinci-003',
            prompt: 'Say connected',
            temperature: 0,
            max_tokens: 3
        };
        return this.http.post(`${environment.baseUrl}/v1/completions`, 
            donnees,
            { 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.apiKey}`
                },
                observe: 'body'
            }
        );
    }

    setKey(token: string): void {
        localStorage.setItem('ranamanaKey', token);
    }

    getKey(): string | null {
        return localStorage.getItem('ranamanaKey');
    }

    isLoggedIn(): boolean {
        return this.getKey() !== null;
    }

    logOut(): void {
        localStorage.removeItem('ranamanaKey');
        this.router.navigateByUrl('/auth');
    }
}