import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { FullRecipe } from '../Models/FullRecipe';
import { RecipeService } from '../Services/recipe.service';
import { PersistentdataService } from '../Services/persistentdata.service';

@Component({
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.scss']
})
export class RecipePageComponent implements OnInit, OnDestroy {

  title: string;
  recipe: FullRecipe;

  constructor(private recipeService: RecipeService, private persDataService: PersistentdataService,
              private router: Router) { }

  ngOnInit() {
    this.recipe = this.persDataService.getCurrentRecipe();
    this.sortSubItems();
    this.title = this.recipe.Name;
  }

  deleteRecipe() {
    this.recipeService.deleteRecipe(this.recipe.RecipeID).subscribe(
      resp => {
        this.router.navigate(['/' + this.recipe.Category]);
      }
    );
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
    this.persDataService.setCurrentRecipe(null);
  }

}
