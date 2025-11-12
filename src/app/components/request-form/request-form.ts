import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiRequest } from '../../services/api';

// --- IMPORTAMOS LOS MÓDULOS DE ANGULAR MATERIAL ---
// (Esta es la sección que ha crecido)
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card'; // <-- El último que añadimos

@Component({
  selector: 'app-request-form',
  standalone: true,
  // --- AÑADIMOS TODOS LOS MÓDULOS AL ARRAY 'imports' ---
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatCardModule // <-- El último que añadimos
  ],
  templateUrl: './request-form.html', // (Verifica tu nombre de archivo)
  styleUrls: ['./request-form.css']   // (Verifica tu nombre de archivo)
})
export class RequestFormComponent {

  // --- ¡LA LÓGICA DE NUESTRO FORMULARIO NO CAMBIA NADA! ---
  // (Todo el código de constructor, headers, onSubmit, etc., es idéntico)

  @Output() makeRequest = new EventEmitter<ApiRequest>();
  @Input() isLoading = false;

  requestForm: FormGroup;
  httpMethods: string[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

  constructor(private fb: FormBuilder) {
    this.requestForm = this.fb.group({
      method: [this.httpMethods[0], Validators.required],
      url: ['', Validators.required],
      body: [''],
      headers: this.fb.array([])
    });

    this.requestForm.get('method')?.valueChanges.subscribe(method => {
      const bodyControl = this.requestForm.get('body');
      if (method === 'GET' || method === 'DELETE') {
        bodyControl?.setValue('');
        bodyControl?.disable();
      } else {
        bodyControl?.enable();
      }
    });
    this.requestForm.get('body')?.disable();
  }

  get headers(): FormArray {
    return this.requestForm.get('headers') as FormArray;
  }

  newHeader(): FormGroup {
    return this.fb.group({
      key: '',
      value: ''
    });
  }

  addHeader() {
    this.headers.push(this.newHeader());
  }

  removeHeader(i: number) {
    this.headers.removeAt(i);
  }

  onSubmit() {
    if (!this.requestForm.valid) {
      console.error('Formulario inválido');
      return;
    }
    const rawValue = this.requestForm.getRawValue();

    const headersObject = rawValue.headers.reduce(
      (acc: { [key: string]: string }, header: { key: string, value: string }) => {
        if (header.key) {
          acc[header.key] = header.value;
        }
        return acc;
      }, 
      {}
    );

    let parsedBody: any = null;
    if (rawValue.body) {
      try {
        parsedBody = JSON.parse(rawValue.body);
      } catch (e) {
        alert('El JSON en el Body no es válido. Por favor, corrígelo.');
        console.error('Error al parsear JSON:', e);
        return; 
      }
    }

    const finalRequest: ApiRequest = {
      method: rawValue.method,
      url: rawValue.url,
      body: parsedBody,
      headers: headersObject
    };
    
    this.makeRequest.emit(finalRequest);
  }
}