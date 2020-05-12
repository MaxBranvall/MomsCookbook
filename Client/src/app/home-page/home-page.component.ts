import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../Services/authentication.service';
import { RecipeService } from '../Services/recipe.service';
import { categories } from '../Models/categories';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  categories = categories;
  env = environment.apiURL;

  constructor(private auth: AuthenticationService, private recipeservice: RecipeService) {}

  ngOnInit() {
  }

  authlogin() {
    this.auth.login('admin', 'admin').subscribe();
  }

}
