import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ← ADD FOR ngModel
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes'; // your routes file

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(FormsModule), // ← ADD FOR ngModel
    // Add other providers here
  ]
}).catch(err => console.error(err));