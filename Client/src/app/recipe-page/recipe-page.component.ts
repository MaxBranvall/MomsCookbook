import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FullRecipe } from '../Models/FullRecipe';
import { RecipeService } from '../Services/recipe.service';
import { PersistentdataService } from '../Services/persistentdata.service';
import { AuthenticationService } from '../Services/authentication.service';
import { Users } from '../Entities/Users';
import { Role } from '../_helpers/role.enum';

@Component({
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.scss']
})
export class RecipePageComponent implements OnInit, OnDestroy {

  title: string;

  /*  Initializes an empty recipe object.
    * This stops errors from popping up while the
    * layout is trying to populate without the recipe
    * loaded in completely
  */
  recipe: FullRecipe = {} as FullRecipe;

  isAdmin = false;

  constructor(private recipeService: RecipeService, private persDataService: PersistentdataService,
              private authService: AuthenticationService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    let id: number;

    // Get the ID of the recipe from the route, assign to id and cast to number
    this.route.url.subscribe(res => { id = +res[1].path; } );

    this.recipeService.getEntry(id).subscribe(
      res =>
      {
        this.recipe = res.body;
        this.persDataService.setCurrentRecipe(this.recipe);
        this.sortSubItems();
        this.title = this.recipe.Name;
      }, error =>
      {
        alert('Your recipe could not be found.\nReturning to home screen.');
        this.router.navigate(['/']);
      }
    );

    this.authService.refreshUser();
    const user: Users = this.authService.currentUserValue;

    this.isAdmin = true ? user !== null && user.Role === Role.Admin : false;

    console.log(this.isAdmin);

  }

  deleteRecipe() {

    const deleteConfirmation = confirm(`Are you sure you would like to delete ${this.recipe.Name}?\n` +
                                        'This action is irreversible.');

    if (deleteConfirmation) {
      this.recipeService.deleteRecipe(this.recipe.RecipeID).subscribe(
        resp => {
          this.router.navigate(['/' + this.recipe.Category]);
        }
      );
    }
  }

  sortSubItems() {
    this.recipe.SubSteps.sort((n1, n2) => {
      if (n1.SubStepID > n2.SubStepID) {
        return 1;
      }

      if (n1.SubStepID < n2.SubStepID) {
        return -1;
      }

      return 0;

    });

    this.recipe.SubTips.sort((n1, n2) => {
      if (n1.SubTipID > n2.SubTipID) {
        return 1;
      }

      if (n1.SubTipID < n2.SubTipID) {
        return -1;
      }

      return 0;

    });

  }

  checkForSubItem(subTipLocalID: number, mainTipLocalID: number) {

    /*
      Used by <li> for subtips and substeps. If true
      the sub tip gets placed under the current tip
      referenced by the mainTipLocalID.
    */

    if (subTipLocalID === mainTipLocalID) {
      return true;
    }
    return false;
  }

  ngOnDestroy() {
    // this.persDataService.setCurrentRecipe(null);
  }

}
