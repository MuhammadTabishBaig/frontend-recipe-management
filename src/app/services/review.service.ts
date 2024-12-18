// review.service.ts

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from '../models/review';

@Injectable({
    providedIn: 'root',
})
export class ReviewService {
    private baseUrl = 'http://localhost:5000/api/review';
    constructor(private httpClient: HttpClient) { }

    getAllReviews(recipeId: string, token: string) {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
            recipeId: `${recipeId}`,
        });
        return this.httpClient.get<Review[]>(`${this.baseUrl}/getAllReviews`, {
            headers,
        });
    }

    getReviewById(id: string, recipeId: string, token: string) {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
            recipeId: `${recipeId}`,
        });
        return this.httpClient.get<Review>(`${this.baseUrl}/getReviewById/${id}`, {
            headers,
        });
    }

    addReview(reviewData: Review, recipeId: string, token: string) {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
            recipeId: `${recipeId}`,
        });
        return this.httpClient.post<Review>(
            `${this.baseUrl}/addReview`,
            reviewData,
            { headers }
        );
    }

    editReview(reviewData: any, recipeId: string, token: string) {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
            recipeId: `${recipeId}`,
        });
        return this.httpClient.put<Review>(
            `${this.baseUrl}/editReview/${reviewData._id}`,
            reviewData,
            { headers }
        );
    }

    deleteReview(id: string, recipeId: string, token: string) {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
            recipeId: `${recipeId}`,
        });
        return this.httpClient.delete<void>(`${this.baseUrl}/deleteReview/${id}`, {
            headers,
        });
    }
}
