import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../Services/authentication.service';
import { RecipeService } from '../Services/recipe.service';
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

  constructor(private auth: AuthenticationService, private recipeservice: RecipeService) {}

  ngOnInit() {
    this.currentUser = this.auth.currentUserValue;
  }

  get isAdmin() {
    return this.currentUser && this.currentUser.Role === Role.Admin;
  }

  private logout() {
    this.auth.logout();
  }

}
