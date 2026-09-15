import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Chart, registerables  } from 'chart.js'; 
import { BaseInterceptor } from './app/modules/user/base.interceptor';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http'; // ✅ importa tudo
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);


bootstrapApplication(AppComponent, {
  providers: [
 
    provideRouter(routes),
        provideHttpClient(withInterceptorsFromDi()), // <-- pega interceptors do DI
    { provide: HTTP_INTERCEPTORS, useClass: BaseInterceptor, multi: true } // <-- registra seu interceptor
  ,
    provideHttpClient(),
    provideAnimations()
  ]
}).catch(err => console.error(err));
