import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthenticationService } from '../Services/authentication.service';
import { LocalStorageItem } from '../_helpers/local-storage-item.enum';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthenticationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    this.authService.refreshUser();
    const currentUser = this.authService.currentUserValue;
    const isApiURL = request.url.startsWith(environment.apiURL);
    if (localStorage.getItem(LocalStorageItem.ResetPassword)) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem(LocalStorageItem.ResetPassword)).Token
        }
      });
    }
    else if (currentUser && isApiURL) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + currentUser.Token
        }
      });
    }

    return next.handle(request);

  }
}
