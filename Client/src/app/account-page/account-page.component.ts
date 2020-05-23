import { Component, OnInit } from '@angular/core';

import { Users } from '../Entities/Users';
import { AuthenticationService } from '../Services/authentication.service';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit {

  private currentUser: Users;

  constructor(private auth: AuthenticationService) { }

  ngOnInit(): void {
    this.currentUser = this.auth.currentUserValue;
  }

}
