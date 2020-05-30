import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticateModel } from '../Models/AuthenticateModel';
import { AuthenticationService } from '../Services/authentication.service';
import { Users } from '../Entities/Users';
import { Role } from '../_helpers/role.enum';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent implements OnInit {

  private newAccount: Users;
  private model: AuthenticateModel;
  private toggleCreateAccount = false;
  private confirmPasswordRef: string;
  private alert = false;
  private loading = false;

  private error = false;
  private errorText: string;
  private errorType: string;
  private statusCode: number;

  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {

    this.model = new AuthenticateModel();
    this.newAccount = new Users();
    this.newAccount.Role = Role.User;

  }

  get diagnostic() {
    return JSON.stringify(this.newAccount);
  }

  onSubmit() {
    this.loading = true;
    this.authService.login(this.model.username, this.model.password).subscribe(x => {

      alert('Logged in successfully! Returning to home screen... ');
      this.router.navigate(['/']);
      this.loading = false;
    },
    error => {
      this.loading = false;
      this.error = true;
      this.errorText = error.error;
      this.errorType = error.statusText;
      this.statusCode = error.status;
      console.log(error);
    });
  }

  onCreateAccount() {
    if (this.passwordValid()) {
      this.alert = false;
      this.loading = true;
      this.authService.createUser(this.newAccount).subscribe(x => {
        if (x.status === 201) {
          this.loading = false;
          alert('Account created successfully! Returning to login screen..');
          this.toggleCreateAccount = false;
          this.router.navigate(['login']);
        }
      },
      error => {
        this.loading = false;
        this.error = true;
        this.errorText = error.error;
        this.errorType = error.statusText;
        this.statusCode = error.status;
      }
      );
      return true;
    }
    this.alert = true;
    return false;
  }

  adminAlert() {
    alert('You will not be granted admin rights until approved by an existing admin.');
  }

  passwordValid() {
    if (this.confirmPasswordRef === this.newAccount.Password) {
      return true;
    }
    return false;
  }

}
