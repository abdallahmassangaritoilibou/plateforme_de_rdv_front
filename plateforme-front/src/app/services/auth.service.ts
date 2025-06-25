import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';


export interface RegisterPayload {
  forename: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: number;
  forename: string;
  surname: string;
  email: string;
}

@Injectable({ 
  providedIn: 'root' 
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  private readonly loginUrl = `${environment.apiUrl}/auth/login`;
  
  constructor(private readonly http: HttpClient) {}

  register(payload: RegisterPayload): Observable<User> {
    return this.http.post<User>(this.apiUrl, payload)
      .pipe(
        catchError(this.handleError)
      );
  }

    login(payload: LoginPayload): Observable<string> {
        return this.http.post(this.loginUrl, payload,{
        responseType: 'text' as const})
        .pipe( 
            catchError(this.handleError)
        );
        
    }
  // Gestion centralisée des erreurs
    private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error) {
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error.message) {
        errorMessage = error.error.message;
      } else {
        // Si c'est un objet avec des erreurs de validation
        const firstError = Object.values(error.error)[0];
        errorMessage = firstError as string || errorMessage;
      }
    }
    
    console.error('Erreur API:', error);
    return throwError(() => errorMessage);
  }
}