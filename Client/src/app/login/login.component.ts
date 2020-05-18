import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticateModel } from '../Models/AuthenticateModel';
import { AuthenticationService } from '../Services/authentication.service';
import { Users } from '../Entities/Users';
import { Role } from '../_helpers/role.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('confirmPassword')
  nameInputRef: ElementRef;

  private newAccount: Users;
  private model: AuthenticateModel;
  private toggleCreateAccount = false;
  private confirmPasswordRef: string;
  private alert = false;

  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {

    this.model = new AuthenticateModel();
    this.newAccount = new Users();
    this.newAccount.Role = Role.User;

  }

  get diagnostic()
  {
    return JSON.stringify(this.newAccount);
  }

  onSubmit() {
    this.authService.login(this.model.username, this.model.password).subscribe(x => {
      this.router.navigate(['/']);
    },
    error => {
      alert(error.error);
      console.log(error);
    });
  }

  onCreateAccount() {
    if (this.passwordValid()) {
      this.alert = false;
      this.authService.createUser(this.newAccount).subscribe(x => {
        console.log(x);
      });
      return true;
    }
    this.alert = true;
    return false;
  }

  passwordValid() {
    if (this.confirmPasswordRef === this.newAccount.Password) {
      return true;
    }
    return false;
  }

}
