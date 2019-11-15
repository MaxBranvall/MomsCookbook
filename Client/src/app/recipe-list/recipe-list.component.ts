import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Recipe } from '../Models/Recipe';
import { ListEntry } from '../Models/ListEntry';

import { RecipeService } from '../Services/recipe.service';


@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {

  title;

  entries: ListEntry[] = [];

  selectedRecipe: Recipe;

  timeInitialized = false;

  recipeSorted = false;
  prepTimeSorted = false;
  cookTimeSorted = false;
  reverseSort = false;
  orderByField = 'Name';

  constructor(
    private route: ActivatedRoute, private recipeService: RecipeService,
    private router: Router
    ) { }

  ngOnInit() {
    this.title = this.route.snapshot.paramMap.get('categoryTitle').toString();
    this.getEntries();
  }

  public onSelect(recipe: Recipe) {
    this.selectedRecipe = recipe;
    this.router.navigateByUrl('/' + this.title + '/' + this.selectedRecipe.Name);
    console.log(JSON.stringify(this.selectedRecipe));
  }

  async getEntries() {

    // Need to reformat preptimeh preptimem cooktimeh cooktimem since db
    // only holds the formatted prep and cook times.

    await this.recipeService.getAllEntries().toPromise().then(res => this.initEntries(res));

  }

  initEntries(recipeList: Recipe[]) {
    recipeList.forEach(entry => {
      const p = this.formatTimes(entry.PrepTime);
      const c = this.formatTimes(entry.CookTime);
      this.entries.push(new ListEntry(entry.ID, entry.ImagePath, entry.Name, entry.PrepTime, entry.CookTime, +p[0], +p[1], +c[0], +c[1]));
      console.log(entry.PrepTime);
    });
  }

  formatTimes(rawTime: string): string[] {
    const split = rawTime.split(':');
    return split;
  }

}
