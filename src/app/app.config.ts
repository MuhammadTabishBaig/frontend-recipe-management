import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';

// import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// export const appConfig: ApplicationConfig = {
//   providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration()]
// };





// app.module.ts

import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { UserComponent } from './components/user/user.component';
import { RecipeComponent } from './components/recipe/recipe.component';
import { ReviewComponent } from './components/review/review.component';
import { RatingComponent } from './components/rating/rating.component';

// @NgModule({
//     declarations: [
//         AppComponent,
//         UserComponent,
//         RecipeComponent,
//         ReviewComponent,
//         RatingComponent,
//     ],
//     imports: [BrowserModule, FormsModule,
//         RouterModule.forRoot(routes)],
//     exports: [RouterModule],
//     providers: [
//         { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
//         JwtHelperService,
//     ],
//     bootstrap: [AppComponent],
// })
// export class AppModule { }

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(), provideAnimationsAsync(), provideHttpClient(withFetch())]
};