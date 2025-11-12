// src/main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
// 1. Lo cambiamos de 'App' a 'AppComponent'
// 2. Y la ruta es './app/app' (porque tu archivo se llama app.ts)
import { AppComponent } from './app/app'; 

// 3. Y le decimos que arranque 'AppComponent'
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));