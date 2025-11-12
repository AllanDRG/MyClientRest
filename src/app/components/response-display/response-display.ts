import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '../../services/api';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

// --- 1. IMPORTAMOS LOS NUEVOS MÓDULOS ---
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-response-display',
  standalone: true,
  // --- 2. LOS AÑADIMOS A 'imports' ---
  imports: [
    CommonModule, 
    NgxJsonViewerModule,
    MatCardModule,
    MatProgressBarModule
  ],
  templateUrl: './response-display.html', // (Verifica tus nombres)
  styleUrls: ['./response-display.css']     // (Verifica tus nombres)
})
export class ResponseDisplayComponent {

  @Input() response: ApiResponse | null = null;
  @Input() error: ApiResponse | null = null;
  @Input() isLoading = false;

}