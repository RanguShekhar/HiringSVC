import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-interview-questions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatListModule
  ],
  templateUrl: './interview-questions.html',
  styleUrls: ['./interview-questions.scss']
})
export class InterviewQuestionsComponent {
  searchQuery = '';
  response = '';
  // results: any[] = [];

  constructor(private apiService: ApiService) { }

  onSearch() {
    this.apiService.RAGInterviewSearch(this.searchQuery).subscribe({
      next: (data) => this.response = data,
      error: () => {
        // Mock results for demo
        // this.results = [
        //   { question: 'What is Angular?', answer: 'Angular is a platform for building mobile and desktop web applications.' }
        // ];
      }
    });
  }
}
