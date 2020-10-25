import { Component, OnInit } from '@angular/core';

import { Users } from '../Entities/Users';
import { AuthenticationService } from '../Services/authentication.service';
import { Role } from '../_helpers/role.enum';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit {

  public currentUser: Users;
  public isAdmin = false;

  constructor(private auth: AuthenticationService) { }

  ngOnInit(): void {
    this.currentUser = this.auth.currentUserValue;

    if (this.currentUser.Role === Role.Admin) {
      this.isAdmin = true;
    }

  }

  notSupported() {
    alert('This feature is not available yet.');
  }

}
