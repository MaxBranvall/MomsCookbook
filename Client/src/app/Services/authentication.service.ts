import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Users } from '../Entities/Users';
import { LocalStorageItem } from '../_helpers/local-storage-item.enum';

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

  createUser(user: Users): Observable<HttpResponse<Users>> {
    return this.http.post<Users>(this.api + 'auth/createuser', user, { observe: 'response' });
  }

  login(username: string, password: string): Observable<HttpResponse<Users>> {

    const body = { username, password };

    return this.http.post<any>(this.api + 'auth/authenticateuser', body)
    .pipe(map(user => {
        if (user && user.Token) {
          localStorage.setItem(LocalStorageItem.CurrentUser, JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }

  logout() {
    localStorage.removeItem(LocalStorageItem.CurrentUser);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

}
