import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: any) => {
        console.error(error);

        switch (error.status) {
          case 0:
            console.error('CORS error...');
            return throwError(error);
            break;
          case 400:
            console.error('Bad Request..');
            return throwError(error.message);
            break;
          case 401:
            console.error('Unauthorized..');
            return throwError(error);
          case 404:
            return throwError(error);
            break;
          default:
            console.log('default');
            break;
        }
      })
    );
  }
}
