import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router'; // <-- importante

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './modules/layouts/main_layout.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { RegisterComponent } from './modules/user/register.component';
import { LoginComponent } from './modules/user/login.component';
import { BaseInterceptor } from './modules/user/base.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http'; 


@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    DashboardComponent,
    RegisterComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule  // <-- precisa estar aqui
  ],
  providers: [
  { provide: HTTP_INTERCEPTORS, useClass: BaseInterceptor, multi: true }
],
  bootstrap: [AppComponent,
    
  ]
})
export class AppModule { }
