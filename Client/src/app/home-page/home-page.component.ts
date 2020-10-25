import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../Services/authentication.service';
import { PollService } from 'src/app/Services/poll.service';
import { categories } from '../Models/categories';
import { environment } from '../../environments/environment';
import { Users } from '../Entities/Users';
import { Role } from '../_helpers/role.enum';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  categories = categories;
  env = environment.apiURL;
  currentUser: Users;

  private apiInitFailed = false;

  constructor(private auth: AuthenticationService, private poll: PollService) {}

  ngOnInit() {
    this.auth.refreshUser();
    this.currentUser = this.auth.currentUserValue;

    this.poll.pollAPI().subscribe(res => {
      console.log('API status: running');
    }, error =>
    {
      this.apiInitFailed = true;

      alert('There was an error polling the API.' +
      '\nThe application may not function as intended.' +
      '\nPlease contact Branflake to get it fixed.');

    }
    );

  }

  get isAdmin() {
    return this.currentUser && this.currentUser.Role === Role.Admin;
  }

  logout() {
    this.auth.logout();
  }

}
