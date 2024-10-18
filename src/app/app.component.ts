// app.component.ts

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';
import { SharedServiceService } from './services/shared-service.service';
import { RatingComponent } from './components/rating/rating.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, FormsModule, CommonModule, RatingComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {
    title = 'Mfsi Recipe Share Assignment';
    isLoggedIn: boolean = false;
    constructor(
        private router: Router,
        private userService: UserService,
        private sharedService: SharedServiceService
    ) { }
    ngOnInit(): void {
        this.userService.loggedInEvent.subscribe((data: any) => {
            this.isLoggedIn = true;
        });
        if (typeof localStorage !== 'undefined' 
        && localStorage.getItem('token')) {
            this.isLoggedIn = true;
        }
    }

    login(): void {
        this.sharedService.triggerLoginEvent();
        this.router.navigate(['/']);
    }

    register(): void {
        this.sharedService.triggerRegisterEvent();
        this.router.navigate(['/']);
    }

    logout(): void {
        this.userService.setAuthenticationStatus(false);
        this.isLoggedIn = false;
        localStorage.removeItem('token');
        localStorage.removeItem('recipeId');
        this.router.navigate(['/']);
    }
}
