import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './terms-of-service.html',
  styleUrls: ['./terms-of-service.scss']
})
export class TermsOfServiceComponent {}
