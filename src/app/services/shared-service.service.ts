// shared-service.service.ts

import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SharedServiceService {
    loginEvent: EventEmitter<void> = new EventEmitter<void>();
    registerEvent: EventEmitter<void> = new EventEmitter<void>();
    recipeIdEvent: EventEmitter<any> = new EventEmitter<any>();
    constructor() { }

    triggerLoginEvent(): void {
        this.loginEvent.emit();
    }

    triggerRegisterEvent(): void {
        this.registerEvent.emit();
    }

    triggerRecipeIdEvent(recipe: any): void {
        this.recipeIdEvent.emit(recipe);
    }
}
