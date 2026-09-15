import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable()
export class BaseInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const base = localStorage.getItem('base');  // pega a base já salva
    //console.log('Base do interceptor:', base);

    if (!base) {
      // se não tiver base, deixa passar mesmo assim
      return next.handle(req);
    }

    const cloned = req.clone({
      setHeaders: { 'x-base': base }
    });

    return next.handle(cloned);
  }
}
