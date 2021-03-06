import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Users } from '../Entities/Users';
import { ForgotPasswordModel } from '../Models/ForgotPasswordModel';
import { LocalStorageItem } from '../_helpers/local-storage-item.enum';
import { Controller } from '../_helpers/controller.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private api = environment.apiURL;
  private currentUserSubject: BehaviorSubject<Users>;
  private currentUser: Observable<Users>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<Users>(JSON.parse(localStorage.getItem(LocalStorageItem.CurrentUser)));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Users {
    return this.currentUserSubject.value;
  }

  refreshUser() {
    this.currentUserSubject.next(JSON.parse(localStorage.getItem(LocalStorageItem.CurrentUser)));
  }

  getUser(id: number): Observable<HttpResponse<number>> {
    return this.http.get<number>(this.api + Controller.Auth, { observe: 'response' });
  }

  createUser(user: Users): Observable<HttpResponse<Users>> {
    return this.http.post<Users>(this.api + Controller.Auth, user, { observe: 'response' });
  }

  login(emailaddress: string, password: string): Observable<HttpResponse<Users>> {

    const body = { emailaddress, password };

    return this.http.post<any>(this.api + 'auth/authenticateuser', body)
    .pipe(map(user => {
        if (user && user.Token) {
          localStorage.setItem(LocalStorageItem.CurrentUser, JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }

  sendForgotPasswordRequest(emailAddress: string): Observable<HttpResponse<string>> {
    return this.http.post<string>(this.api + Controller.Auth + '/getChangePasswordToken', { emailAddress }, { observe: 'response' });
  }

  verifyForgotPasswordToken(): Observable<HttpResponse<string>> {
    return this.http.get<string>(this.api + Controller.Auth + '/verifyChangePasswordToken', { observe: 'response' }).pipe(
      retry(3)
    );
  }

  resetPassword(user: Users): Observable<HttpResponse<Users>> {
    const body = user;
    return this.http.put<Users>(this.api + Controller.Auth + '/changePassword', user, { observe: 'response' });
  }

  verifyEmail(id: number): Observable<HttpResponse<string>> {
    return this.http.put<HttpResponse<string>>(this.api + Controller.Auth + '/verify/' + id, { observe: 'response' }).pipe(
      retry(3)
    );
  }

  logout() {
    localStorage.removeItem(LocalStorageItem.CurrentUser);
    this.currentUserSubject.next(null);
    alert('Successfully logged out..');
    window.location.reload();
  }

}
