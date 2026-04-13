import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  // ← ADD THIS
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component'; // your component

@NgModule({
  declarations: [
  ],
  imports: [
    AppComponent,
    LoginComponent,
    BrowserModule,
    AppRoutingModule,
    FormsModule,        // ← ADD THIS
    HttpClientModule    // if needed for AuthService
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }