// recipe.service.ts

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root',
})
export class RecipeService {
    private baseUrl = 'http://localhost:5000/api/recipe';
    constructor(private httpClient: HttpClient) { }

    getAllRecipes(token: string): Observable<Recipe[]> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this.httpClient.get<Recipe[]>
            (`${this.baseUrl}/getAllRecipes`, {
                headers,
            });
    }

    getRecipeById(id: string, token: string):
        Observable<Recipe> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this.httpClient.get<Recipe>(
            `${this.baseUrl}/getRecipeById/${id}`,
            { headers }
        );
    }

    createRecipe(recipe: Recipe, token: string):
        Observable<Recipe> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this.httpClient.post<Recipe>(
            `${this.baseUrl}/createRecipe`,
            recipe,
            { headers }
        );
    }

    updateRecipe(recipe: any, token: string):
        Observable<Recipe> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this.httpClient.put<Recipe>(
            `${this.baseUrl}/updateRecipe/${recipe._id}`,
            recipe,
            { headers }
        );
    }

    deleteRecipe(id: string, token: string):
        Observable<void> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this.httpClient.delete<void>
            (`${this.baseUrl}/deleteRecipe/${id}`, {
                headers,
            });
    }

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
