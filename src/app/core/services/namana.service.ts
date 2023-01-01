import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { DataRequestModel } from "../models/namana.model";

@Injectable({
    providedIn: 'root'
})
export class NamanaService {
    constructor(
        private http: HttpClient
    ) {}

    private getKey(): string | null {
        return localStorage.getItem('ranamanaKey');
    }

    requestOpenai(prompt: string): Observable<any> {
        const donnees: DataRequestModel = {
            model: 'text-davinci-003',
            prompt: prompt,
            temperature: 0.99,
            max_tokens: 3131,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.6,
            stop: [".?!,;"]
        };
        return this.http.post(`${environment.baseUrl}/v1/completions`, 
            donnees,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getKey()}`
                },
                observe: 'response'
            }
        );
    }
}
