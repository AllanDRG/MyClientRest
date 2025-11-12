import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// --- Definimos las interfaces aquí mismo por ahora ---
// (Luego podemos moverlas a sus propios archivos)

export interface ApiRequest {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: { [key: string]: string };
  body?: any;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  body: any;
  responseTime: number; // en milisegundos
}

// --------------------------------------------------


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  /**
   * Ejecuta una petición HTTP genérica.
   * @param requestData Los datos de la solicitud (url, método, etc.)
   */
  executeRequest(requestData: ApiRequest): Observable<ApiResponse> {
    
    const startTime = performance.now(); // 1. Medimos el tiempo de inicio

    const httpHeaders = new HttpHeaders(requestData.headers);

    // 2. Usamos .request() porque es genérico y acepta el método como string
    const request$ = this.http.request(requestData.method, requestData.url, {
      body: requestData.body,
      headers: httpHeaders,
      observe: 'response', // <-- ¡CRÍTICO! Para obtener la respuesta completa
      responseType: 'json'
    });

    return request$.pipe(
      // 3. Mapeamos la respuesta completa a nuestra interfaz ApiResponse
      map((response: HttpResponse<any>) => {
        const endTime = performance.now();
        const responseTime = endTime - startTime;

        return {
          status: response.status,
          statusText: response.statusText,
          body: response.body,
          responseTime: Math.round(responseTime)
        };
      }),
      // 4. Manejamos errores HTTP
      catchError((error) => {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        // Creamos un objeto de error con la misma interfaz
        const errorResponse: ApiResponse = {
          status: error.status || 500, // A veces el error no tiene status
          statusText: error.statusText || 'Error',
          body: error.error, // El cuerpo del error (si lo hay)
          responseTime: Math.round(responseTime)
        };
        // Devolvemos un Observable que emite el error formateado
        return throwError(() => errorResponse); 
      })
    );
  }
}