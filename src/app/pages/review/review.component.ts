// review.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../models/review';
import { Router } from '@angular/router';
import { SharedServiceService } from '../../services/shared-service.service';
import { ObjectService } from '../../services/object.service';
import { RecipeService } from '../../services/recipe.service';
import { RatingComponent } from '../rating/rating.component';

@Component({
    selector: 'app-review',
    standalone: true,
    imports: [FormsModule, CommonModule, RatingComponent],
    templateUrl: './review.component.html',
    styleUrl: './review.component.css',
})
export class ReviewComponent implements OnInit {
    reviewDataAdded: Review = {
        userId: '',
        recipeId: '',
        rating: 0,
        comment: '',
    };
    reviewById: Review = {
        userId: '',
        recipeId: '',
        rating: 0,
        comment: '',
    };
    reviewList: any[] = [];
    showReviewAddForm: boolean = false;
    displayedReviewList: any[] = [];
    isLoggedIn: boolean = false;
    reviewUpdated: any = {
        userId: '',
        recipeId: '',
        rating: 0,
        comment: '',
    };
    showReviewEditForm: boolean = false;
    errorMessage: string = '';
    recipeId: any = '';
    recipe: any = {
        id: '',
        userId: '',
        recipeName: '',
        recipeSteps: '',
        recipeIngredients: '',
        recipeTime: 0,
        recipeImageUrl: '',
    };
    username: string = '';
    email: string = '';
    stars: number[] = [1, 2, 3, 4, 5];
    constructor(
        private reviewService: ReviewService,
        private userService: UserService,
        private router: Router,
        private sharedService: SharedServiceService,
        private objectService: ObjectService
    ) { }
    ngOnInit() {
        this.sharedService.recipeIdEvent.subscribe((recipe: any) => {
            this.recipeId = recipe._id;
            if (localStorage.getItem('recipeId')) {
                localStorage.removeItem('recipeId');
            }
            localStorage.setItem('recipeId', this.recipeId);
            this.recipe = recipe;
        });
        this.getAllReviews();
    }

    getUserFromId(id: string): void {
        this.objectService.getObjectById(id).subscribe((userData: any) => {
            this.username = userData.username;
            this.email = userData.email;
        });
    }

    getRecipeFromId(id: string): any {
        this.objectService
            .getRecipeObjectById(id)
            .subscribe((recipeData: any) => {
                this.recipe = {
                    id: recipeData._id,
                    userId: recipeData.user,
                    recipeName: recipeData.recipeName,
                    recipeSteps: recipeData.recipeSteps,
                    recipeIngredients: recipeData.recipeIngredients,
                    recipeTime: recipeData.recipeTime,
                    recipeImageUrl: recipeData.recipeImageUrl,
                };

                this.getUserFromId(this.recipe.userId);
            });
        return this.recipe;
    }

    ifLoggedIn(): boolean {
        this.userService.isAuthenticated()
        .subscribe((isAuthenticated: boolean) => {
            this.isLoggedIn = isAuthenticated;
        });
        return this.isLoggedIn;
    }

    getAllReviews(): void {
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem('token');
            const recipeId = localStorage.getItem('recipeId');
            if (token && recipeId) {
                this.getRecipeFromId(recipeId);
                this.reviewService
                    .getAllReviews(recipeId, token)
                    .subscribe((reviewList) => {
                        this.reviewList = reviewList;
                        this.displayedReviewList = [...this.reviewList];
                    });
            }
        }
    }

    getReviewById(id: string): void {
        const token = localStorage.getItem('token');
        this.showReviewAddForm = false;
        this.showReviewEditForm = false;
        if (token) {
            this.reviewService
            .getReviewById(id, this.recipeId, token).subscribe(
                (review) => {
                    this.reviewById = review;
                },
                (error) => {
                    console.error('Error in getting review:', error);
                }
            );
        }
    }

    addReview(recipeId: string): void {
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                this.reviewDataAdded.recipeId = recipeId;
                
                if(this.recipe.userId === this.getUserId()){
                    this.errorMessage = "You can not review your own recipe!";
                }
                else if (this.reviewList.find(s => s.userId == this.getUserId() && s.recipeId == recipeId)){
                    this.errorMessage = "Review already exist for the same recipe, Please update it!";
                }
                else{
                this.reviewService
                    .addReview(this.reviewDataAdded, this.recipeId, token)
                    .subscribe((reviewDataAdded) => {
                        this.reviewDataAdded = reviewDataAdded;
                        this.showReviewAddForm = false;
                        this.router.navigate(['/getAllReviews']);
                        this.getAllReviews();
                    });
                }
            }
        }
    }

    resetForm(): void {
        this.reviewDataAdded = {
            userId: '',
            recipeId: '',
            rating: 0,
            comment: '',
        };
    }

    closeAddForm(): void {
        this.reviewDataAdded = {
            userId: '',
            recipeId: '',
            rating: 0,
            comment: '',
        };
        this.showReviewAddForm = false;
    }

    showAddFormFunction(id: string): void {
        if (typeof localStorage !== 'undefined') {
            this.recipeId = localStorage.getItem('recipeId');
            this.getRecipeFromId(this.recipeId);
        }
        this.showReviewAddForm = true;
    }

    updateRating(event: any): void {
        this.onRatingChanged(event.target.value);
    }

    getUserId(): string | null {
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                const tokenPayload = JSON.parse(atob(token.split('.')[1]));
                return tokenPayload.user.id;
            }
        }
        return null;
    }

    onRatingChanged(newRating: number): void {
        if (this.reviewDataAdded) {
            this.reviewDataAdded.rating = newRating;
        }
        if (this.reviewUpdated) {
            this.reviewUpdated.rating = newRating;
        }
    }

    populateForm(review: Review): void {
        this.reviewUpdated = { ...review };
        this.showReviewEditForm = true;
    }

    editReview(reviewId: string): void {
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem('token');
            const recipeId = localStorage.getItem('recipeId');
            if (token && recipeId) {
                this.reviewUpdated.recipeId = recipeId;
                this.reviewService
                    .editReview(this.reviewUpdated, recipeId, token)
                    .subscribe(
                        (reviewUpdated: any) => {
                            const index = this.displayedReviewList.findIndex(
                                (r) => reviewId === r._id
                            );
                            if (index !== -1) {
                                this.router.navigate(['/getAllReviews']);
                                this.reviewList[index] = reviewUpdated;
                                this.displayedReviewList[index] = reviewUpdated;
                                this.getAllReviews();
                                this.showReviewEditForm = false;
                            }
                            this.cancelEdit();
                        },
                        (error) => {
                            this.errorMessage = error;
                        }
                    );
            }
        }
    }

    cancelEdit(): void {
        this.showReviewEditForm = false;
        this.reviewUpdated = {
            userId: '',
            recipeId: '',
            rating: 0,
            comment: '',
        };
        this.reviewDataAdded = {
            userId: '',
            recipeId: '',
            rating: 0,
            comment: '',
        };
    }

    confirmDelete(reviewId: string): void {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this review?'
        );
        if (confirmDelete) {
            this.deleteReview(reviewId);
        }
    }

    deleteReview(reviewId: string): void {
        const token = localStorage.getItem('token');
        this.showReviewEditForm = false;
        if (token) {
            this.reviewService
                .deleteReview(reviewId, this.recipeId, token)
                .subscribe(
                    () => {
                        this.reviewList = this.reviewList.filter(
                            (review: any) => review._id !== reviewId
                        );
                        this.displayedReviewList = [...this.reviewList];
                    },
                    (error) => {
                        this.errorMessage = error;
                    }
                );
        }
    }
}
