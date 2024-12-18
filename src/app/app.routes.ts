// import { Routes } from '@angular/router';

// export const routes: Routes = [];

// app.routes.ts
import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { UserComponent } from './pages/user/user.component';
import { LoaderComponent } from './components/loader/loader.component';
import { RecipeComponent } from './pages/recipe/recipe.component';
import { ReviewComponent } from './pages/review/review.component';

import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBarModule} from '@angular/material/snack-bar';


export const routes: Routes = [
    { path: '', component: UserComponent },
    { path: 'getAllRecipes', component: RecipeComponent },
    { path: 'getRecipeById/:id', component: RecipeComponent },
    { path: 'createRecipe', component: RecipeComponent },
    { path: 'updateRecipe/:id', component: RecipeComponent },
    { path: 'deleteRecipe/:id', component: RecipeComponent },
    { path: 'getAllReviews', component: ReviewComponent },
    { path: 'getReviewById', component: ReviewComponent },
    { path: 'addReview', component: ReviewComponent },
    { path: 'editReview/:id', component: ReviewComponent },
    { path: 'deleteReview/:id', component: ReviewComponent },
    { path: '**', redirectTo: '/' }
];

@NgModule({
    declarations: [
        // AppComponent,
        // UserComponent,
        // RecipeComponent,
        // ReviewComponent,
    ],
    imports: [BrowserModule, FormsModule,
        RouterModule.forRoot(routes), MatSnackBarModule],
    exports: [RouterModule],
    providers: [
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
        JwtHelperService,
    ],
    bootstrap: [AppComponent],
})
export class AppRoutingModule { }
