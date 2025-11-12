import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

// 1. --- Importamos TODOS nuestros componentes y servicios ---
import { RequestFormComponent } from './components/request-form/request-form';
import { ResponseDisplayComponent } from './components/response-display/response-display';
import { ApiService, ApiRequest, ApiResponse } from './services/api';

@Component({
  selector: 'app-root',
  standalone: true,
  // 2. --- Añadimos ResponseDisplayComponent a los imports ---
  imports: [
    CommonModule, 
    RequestFormComponent, 
    ResponseDisplayComponent // <-- AÑADIR ESTE
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  
  // 3. --- Definimos el estado de la aplicación ---
  isLoading = false;
  apiResponse: ApiResponse | null = null;
  error: ApiResponse | null = null;

  // 4. --- Inyectamos nuestro ApiService ---
  constructor(private apiService: ApiService) {}

  /**
   * 5. --- Este método será llamado por el evento (makeRequest) del formulario ---
   */
  handleRequest(requestData: ApiRequest) {
    this.isLoading = true;
    this.apiResponse = null;
    this.error = null;

    this.apiService.executeRequest(requestData)
      .pipe(
        // 6. --- finalize() se ejecuta siempre (éxito o error) ---
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response) => {
          // 7. --- Éxito: Guardamos la respuesta ---
          this.apiResponse = response;
        },
        error: (errorResponse) => {
          // 8. --- Error: Guardamos el error ---
          this.error = errorResponse;
        }
      });
  }
}