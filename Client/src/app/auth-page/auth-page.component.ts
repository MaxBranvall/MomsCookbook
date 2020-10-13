import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticateModel } from '../Models/AuthenticateModel';
import { ForgotPasswordModel } from '../Models/ForgotPasswordModel';
import { AuthenticationService } from '../Services/authentication.service';
import { Users } from '../Entities/Users';
import { Role } from '../_helpers/role.enum';

import {default as decode } from 'jwt-decode';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent implements OnInit {

  public newAccount: Users;
  public forgotPassword: ForgotPasswordModel;
  public model: AuthenticateModel;
  public default = true;
  public toggleCreateAccount = false;
  public toggleForgotPassword = false;
  public confirmPasswordRef: string;
  public alert = false;
  public loading = false;

  public error = false;
  public errorText: string;
  public errorType: string;
  public statusCode: number;

  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {

    this.forgotPassword = new ForgotPasswordModel();
    this.model = new AuthenticateModel();
    this.newAccount = new Users();
    this.newAccount.Role = Role.User;

  }

  get diagnostic() {
    return JSON.stringify(this.model);
  }

  onSubmit() {
    this.loading = true;
    this.authService.login(this.model.EmailAddress, this.model.Password).subscribe(x => {

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

  toggleCreateAccountLayout() {
    this.default = false;
    this.toggleForgotPassword = false;
    this.toggleCreateAccount = true;
  }

  toggleResetPasswordLayout() {
    this.default = false;
    this.toggleCreateAccount = false;
    this.toggleForgotPassword = true;
  }

  toggleDefaultLayout() {
    this.default = true;
    this.toggleCreateAccount = false;
    this.toggleForgotPassword = false;
}

  clearAlertsAndFields() {
    this.error = null;
    this.model.EmailAddress = null;
    this.model.Password = null;
    this.forgotPassword.EmailAddress = null;
  }

  onCreateAccount() {
    if (this.passwordValid()) {
      this.alert = false;
      this.loading = true;
      this.authService.createUser(this.newAccount).subscribe(x => {
        if (x.status === 201) {
          this.loading = false;
          alert('Account created successfully! Returning to login screen..');
          this.toggleDefaultLayout();
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

  onForgotPassword() {
    this.loading = true;
    this.authService.sendForgotPasswordRequest(this.forgotPassword.EmailAddress).subscribe(x => {
      if (x.status === 200 || x.status === 204) {
        this.loading = false;
        alert('A link has been sent to your email to reset your password.');
        this.clearAlertsAndFields();
        this.toggleDefaultLayout();
        return true;
      }
    }, error => {
      this.loading = false;
      this.error = true;
      this.errorText = error.error;
      this.errorType = error.statusText;
      this.statusCode = error.status;
    }
    );
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
