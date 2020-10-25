import { Component, OnInit } from '@angular/core';

import { Users } from '../Entities/Users';
import { AuthenticationService } from '../Services/authentication.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {

  public currentUser: Users;

  constructor(private auth: AuthenticationService) { }

  ngOnInit() {
    this.currentUser = this.auth.currentUserValue;
  }

}
