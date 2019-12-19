import { Component, OnInit } from '@angular/core';
import { FullRecipe } from '../Models/FullRecipe';

import { RecipeService } from '../Services/recipe.service';
import { PersistentdataService } from '../Services/persistentdata.service';

import { ListEntry } from '../Models/ListEntry';

@Component({
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.scss']
})
export class RecipePageComponent implements OnInit {

  title: string;
  recipe: FullRecipe;

  get currentRecipe(): ListEntry {
    return this.persDataService.currentRecipe;
  }

  constructor(private recipeService: RecipeService, private persDataService: PersistentdataService) { }

  async ngOnInit() {
    this.recipe = this.persDataService.getCurrentRecipe();
    this.title = this.recipe.Name;
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

}
