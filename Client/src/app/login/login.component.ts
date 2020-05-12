import { Component, OnInit } from '@angular/core';
import { Users } from '../Entities/Users';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private user: Users;

  constructor() { }

  ngOnInit(): void {

    this.user = new Users();

  }

}
