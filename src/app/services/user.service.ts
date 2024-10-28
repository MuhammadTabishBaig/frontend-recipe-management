// user.service.ts

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root',
})
//TODO: only add till api in the baseUrl in ENV, rest all can go inside the method call
export class UserService {
    private baseUrl = 'http://localhost:5000/api/user';
    constructor(private httpClient: HttpClient) { }

    register(userData: any): Observable<any> {
        return this.httpClient
        .post(`${this.baseUrl}/register`, userData);
    }

    login(credentials: any): Observable<any> {
        return this.httpClient
        .post(`${this.baseUrl}/login`, credentials);
    }

    private isAuthenticatedSubject = 
        new BehaviorSubject<boolean>(false);

    isAuthenticated(): Observable<boolean> {
        return this.isAuthenticatedSubject.asObservable();
    }

    setAuthenticationStatus(isAuthenticated: boolean): void {
        this.isAuthenticatedSubject
        .next(isAuthenticated);
    }

    loggedInEvent: EventEmitter<any> = new EventEmitter();
    emitLoggedInEvent() {
        this.loggedInEvent.emit();
    }
//TODO: use http interceptors
    getAllUsers(token: string): Observable<User[]> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this.httpClient.get<User[]>
            (`${this.baseUrl}/getAllUsers`, {
                headers,
            });
    }
}
