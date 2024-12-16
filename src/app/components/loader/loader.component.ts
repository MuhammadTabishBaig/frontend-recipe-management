import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
  loading: boolean = false;

  constructor(private loaderService: LoaderService) {
    this.loaderService.loading$.subscribe(loading => {
      this.loading = loading;
    });
  }
}