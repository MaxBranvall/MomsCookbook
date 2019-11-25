import { Component, OnInit } from '@angular/core';
import { Entry } from '../Models/Entry';
import { ActivatedRoute } from '@angular/router';

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
  recipe: Entry = new Entry(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);

  get currentRecipe(): ListEntry {
    return this.persDataService.currentRecipe;
  }

  constructor(private route: ActivatedRoute, private recipeService: RecipeService,
              private persDataService: PersistentdataService) { }

  async ngOnInit() {
    this.title = this.currentRecipe.Name;
    await this.recipeService.getEntry(this.currentRecipe.RecipeID).toPromise().then(res => this.initRecipe(res));
  }

  initRecipe(entry: Entry) {

    this.recipe = entry;
    this.recipe.ImageLoaded = false;

    const p = this.formatTimes(this.recipe.PrepTime);
    const c = this.formatTimes(this.recipe.CookTime);

    this.recipe.PrepTimeH = +p[0];
    this.recipe.PrepTimeM = +p[1];
    this.recipe.CookTimeH = +c[0];
    this.recipe.CookTimeM = +c[1];

  }

  formatTimes(rawTime: string): string[] {
    const split = rawTime.split(':');
    return split;
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
