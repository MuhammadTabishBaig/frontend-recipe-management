// rating.component.ts

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-rating',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './rating.component.html',
    styleUrl: './rating.component.css',
})
export class RatingComponent implements OnInit {
    @Input() rating: number = 0;
    @Output() ratingChanged: EventEmitter<number>
     = new EventEmitter<number>();
    @Input() isDisabled: boolean = false;

    filledRatings: number = 0;
    ratings: number[] = [];

    constructor() { }

    ngOnInit(): void {
        this.ratings = [0, 1, 2, 3, 4];
        this.filledRatings = Math.floor(this.rating);
    }

    rate(index: number): void {
        if (!this.isDisabled) {
            this.filledRatings = index + 1;
            this.ratingChanged.emit(this.filledRatings);
        }
    }
}
