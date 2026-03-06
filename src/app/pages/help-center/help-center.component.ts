import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatExpansionModule, MatIconModule],
  templateUrl: './help-center.html',
  styleUrls: ['./help-center.scss']
})
export class HelpCenterComponent {}
