// recipe.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { SharedServiceService } from '../../services/shared-service.service';

@Component({
    selector: 'app-recipe',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './recipe.component.html',
    styleUrl: './recipe.component.css',
})
export class RecipeComponent implements OnInit {
    isLoggedIn: boolean = false;
    recipeList: any[] = [];
    displayedRecipeList: any[] = [];
    userList: any[] =[];
    displayedUserList: any[] =[];
    recipeById: any = {
        recipeName: '',
        recipeSteps: '',
        recipeIngredients: '',
        recipeTime: 0,
        recipeImageUrl: '',
        numberOfReviews: 0,
        reviews: [],
    };
    recipeCreated: any = {
        recipeName: '',
        recipeSteps: '',
        recipeIngredients: '',
        recipeTime: 0,
        recipeImageUrl: '',
        numberOfReviews: 0,
        reviews: [],
    };
    recipeUpdated: any = {};
    showUpdateForm: boolean = false;
    showAddForm: boolean = false;
    showUsersList: boolean = false;
    errorMessage: string = '';
    searchQueryCategory: string = '';
    searchQueryIngredients: string = '';
    searchQuery: string = '';
    constructor(
        private recipeService: RecipeService,
        private userService: UserService,
        private router: Router,
        private sharedService: SharedServiceService
    ) { }
    ngOnInit(): void {
        if (typeof localStorage !== 'undefined' 
            && localStorage.getItem('token')) {
            this.getAllRecipes();
        }
    }

    ifLoggedIn(): boolean {
        this.userService.isAuthenticated()
            .subscribe((isAuthenticated: boolean) => {
            this.isLoggedIn = isAuthenticated;
        });
        return this.isLoggedIn;
    }

    getUserId(): string | null {
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                const tokenPayload = JSON.parse(atob(token.split('.')[1]));
                // console.log(tokenPayload);
                return tokenPayload.user.id;
            }
        }
        return null;
    }

    getAllRecipes(): void {
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                this.recipeService
                    .getAllRecipes(token)
                    .subscribe((recipeList: any) => {
                        this.recipeList = recipeList;
                        this.displayedRecipeList = [...this.recipeList];
                    });
            }
        }
    }

    getRecipeById(id: string): void {
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                this.showUpdateForm = false;
                this.showAddForm = false;
                this.recipeService
                    .getRecipeById(id, token)
                    .subscribe((recipeById) => {
                        this.recipeById = recipeById;
                    });
            }
        }
    }

    createRecipe(): void {
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                this.showAddForm = true;
                this.showUpdateForm = false;
                this.recipeService
                    .createRecipe(this.recipeCreated, token)
                    .subscribe((recipeCreated) => {
                        this.recipeCreated = recipeCreated;
                        this.closeAddForm();
                        this.getAllRecipes();
                        this.router.navigate(['/getAllRecipes']);
                    });
            }
        }
    }

    resetForm(): void {
        this.recipeCreated = {
            recipeName: '',
            recipeSteps: '',
            recipeIngredients: '',
            recipeTime: 0,
            recipeImageUrl: '',
            numberOfReviews: 0,
            reviews: [],
        };
    }

    closeAddForm(): void {
        this.recipeCreated = {
            recipeName: '',
            recipeSteps: '',
            recipeIngredients: '',
            recipeTime: 0,
            recipeImageUrl: '',
            numberOfReviews: 0,
            reviews: [],
        };
        this.showAddForm = false;
    }

    showAddFormFunction(): void {
        this.showAddForm = true;
    }

    closeView(): void {
        this.recipeById = {
            recipeName: '',
            recipeSteps: '',
            recipeIngredients: '',
            recipeTime: 0,
            recipeImageUrl: '',
            numberOfReviews: 0,
            reviews: [],
        };
    }

    populateUpdateForm(recipe: Recipe) {
        this.recipeUpdated = { ...recipe };
        this.showUpdateForm = true;
    }

    updateRecipe(id: string): Recipe {
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                this.recipeService.updateRecipe(this.recipeUpdated, token).subscribe(
                    (recipeUpdated: any) => {
                        const index = this.displayedRecipeList.findIndex(
                            (p) => p._id === id
                        );
                        if (index !== -1) {
                            this.recipeList[index] = recipeUpdated;
                            this.displayedRecipeList[index] = recipeUpdated;
                            this.getAllRecipes();
                            this.showUpdateForm = false;
                            this.router.navigate(['/getAllRecipes']);
                        }
                        this.cancelUpdate();
                    },
                    (error) => {
                        this.errorMessage = 'Error Updating Recipe';
                    }
                );
            }
        }
        return this.recipeUpdated;
    }

    cancelUpdate(): void {
        this.showUpdateForm = false;
        this.recipeUpdated = {
            recipeName: '',
            recipeSteps: '',
            recipeIngredients: '',
            recipeTime: 0,
            recipeImageUrl: '',
            numberOfReviews: 0,
            reviews: [],
        };
        this.recipeById = {
            recipeName: '',
            recipeSteps: '',
            recipeIngredients: '',
            recipeTime: 0,
            recipeImageUrl: '',
            numberOfReviews: 0,
            reviews: [],
        };
    }

    confirmDelete(recipeId: string): void {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this recipe?'
        );
        if (confirmDelete) {
            this.deleteRecipe(recipeId);
        }
    }

    deleteRecipe(id: string): void {
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                this.recipeService.deleteRecipe(id, token).subscribe(
                    () => {
                        this.recipeList = this.recipeList.filter(
                            (recipe: any) => recipe._id !== id
                        );
                        this.displayedRecipeList = [...this.recipeList];
                    },
                    (error) => {
                        this.errorMessage = 'Error Deleting recipe';
                    }
                );
            }
        }
    }

    getReviews(recipe: any): void {
        console.log(recipe);
        localStorage.setItem('recipeId', recipe._id);
        this.sharedService.triggerRecipeIdEvent(recipe);
        this.router.navigate(['/getAllReviews']);
    }

    applyFilter(): void {
        if (!this.searchQuery?.trim() && !this.searchQueryIngredients?.trim()) {
            this.displayedRecipeList = [...this.recipeList];
        } else if (this.searchQueryIngredients?.trim() && !this.searchQuery?.trim()) {
            const queryIngredients = this.searchQueryIngredients
                ? this.searchQueryIngredients.toLowerCase().trim()
                : this.searchQueryIngredients;
            this.displayedRecipeList = this.recipeList.filter((recipe) =>
                recipe.recipeIngredients.toString().toLowerCase().includes(queryIngredients)
            );
        } else if (!this.searchQueryIngredients?.trim() && this.searchQuery?.trim()) {
            const query = this.searchQuery
                ? this.searchQuery.toLowerCase().trim()
                : this.searchQuery;
            this.displayedRecipeList = this.recipeList.filter((recipe) =>
                recipe.recipeName.toLowerCase().includes(query)
            );
        } else {
            const query = this.searchQuery
                ? this.searchQuery.toLowerCase().trim()
                : this.searchQuery;
            const queryIngredients = this.searchQueryIngredients
                ? this.searchQueryIngredients.toLowerCase().trim()
                : this.searchQueryIngredients;
            this.displayedRecipeList = this.recipeList.filter(
                (recipe) =>
                    recipe.recipeName.toLowerCase().includes(query) &&
                    recipe.recipeIngredients
                        .toString()
                        .toLowerCase()
                        .includes(queryIngredients)
            );
        }
    }

    clearFilter(): void {
        this.searchQuery = '';
        this.applyFilter();
    }

    clearFilterCategory(): void {
        this.searchQueryIngredients = '';
        this.applyFilter();
    }

    clearFilterIngredient(): void {
        this.searchQueryIngredients = '';
        this.applyFilter();
    }

    getAllUsers(): void {
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem('token');
            console.log(token);
            if (token) {
                console.log("inside if");
                this.recipeService.getAllUsers(token)
                    .subscribe((userList: any) => {
                        this.userList = this.userList;
                        this.displayedUserList = [...this.userList];
                    });
            }
        }
    }

    shareRecipe(id: string): void {
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                // this.userService.getAllUsers();
                this.showUpdateForm = false;
                this.showAddForm = false;
                this.showUsersList = false;
                this.recipeService
                    .getRecipeById(id, token)
                    .subscribe((recipeById) => {
                        this.recipeById = recipeById;
                    });
            }
        }
    }

}
