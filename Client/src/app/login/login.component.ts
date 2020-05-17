import { Component, OnInit } from '@angular/core';
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

  private newAccount: Users;
  private model: AuthenticateModel;
  private toggleCreateAccount = false;

  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {

    this.model = new AuthenticateModel();
    this.newAccount = new Users();

  }

  get diagnostic()
  {
    return JSON.stringify(this.newAccount);
  }

  onSubmit() {
    this.authService.login(this.model.username, this.model.password).subscribe(x => {
      this.router.navigate(['/']);
    });
  }

}
