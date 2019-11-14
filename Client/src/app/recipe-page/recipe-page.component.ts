import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Entry } from '../Models/Entry';
import { Recipe } from '../Models/Recipe';
import { ActivatedRoute } from '@angular/router';

import { RecipeService } from '../Services/recipe.service';

@Component({
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.scss']
})
export class RecipePageComponent implements OnInit {

  // @Input() recipe: Recipe;
  title: string;
  recipe: Entry = new Entry(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);

  constructor(private route: ActivatedRoute, private recipeService: RecipeService) { }

  async ngOnInit() {

    this.title = this.route.snapshot.paramMap.get("recipeName").toString();
    await this.recipeService.getEntry(this.title).toPromise().then(res => this.initRecipe(res));
    console.log(JSON.stringify(this.recipe));
    console.log(this.title);
  }

  initRecipe(entry: Entry)
  {

    this.recipe = entry;

    let p = this.formatTimes(this.recipe.PrepTime);
    let c = this.formatTimes(this.recipe.CookTime);

    this.recipe.PrepTimeH = +p[0];
    this.recipe.PrepTimeM = +p[1];
    this.recipe.CookTimeH = +c[0];
    this.recipe.CookTimeM = +c[1];

  }

  formatTimes(rawTime: string) : string[]
  {
    let split = rawTime.split(":");
    console.log(split);
    return split;
  }

  checkForSubItem(subTipLocalID: number, mainTipLocalID: number) {

    /*
      Used by <li> for subtips and substeps. If true
      the sub tip gets placed under the current tip
      referenced by the mainTipLocalID.
    */

    if (subTipLocalID == mainTipLocalID) {
      return true;
    }
    return false;
  }

}
