import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Recipe } from '../Models/Recipe';
import { Entry } from '../Models/Entry';
import { ListEntry } from '../Models/ListEntry';

import { RecipeService } from '../Services/recipe.service';
import { AngularFireStorage } from '@angular/fire/storage';


@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {

  constructor(
    private route: ActivatedRoute, private recipeService: RecipeService,
    private storage: AngularFireStorage, private router: Router
    ) { }

  ngOnInit() {
    this.title = this.route.snapshot.paramMap.get('categoryTitle').toString();
    this.getEntries();
  }

  title;

  entries: ListEntry[] = [];

  selectedRecipe: Recipe;

  timeInitialized: boolean = false;

  recipeSorted: boolean = false;
  prepTimeSorted: boolean = false;
  cookTimeSorted: boolean = false;
  reverseSort = false;
  orderByField="Name";

  public onSelect(recipe: Recipe)
  {
    this.selectedRecipe = recipe;
    this.router.navigateByUrl("/" + this.title + "/" + this.selectedRecipe.Name);
    console.log(JSON.stringify(this.selectedRecipe));
  }

  async getEntries() {

    // Need to reformat preptimeh preptimem cooktimeh cooktimem since db
    // only holds the formatted prep and cook times.

    await this.recipeService.getAllEntries().toPromise().then(res => this.initEntries(res));

  }

  initEntries(recipeList: Recipe[])
  {
    recipeList.forEach(entry => {
      let p = this.formatTimes(entry.PrepTime);
      let c = this.formatTimes(entry.CookTime);
      this.entries.push(new ListEntry(entry.ID, entry.ImagePath, entry.Name, +p[0], +p[1], +c[0], +c[1]))
    });
  }

  formatTimes(rawTime: string) : string[]
  {
    let split = rawTime.split(":");
    console.log(split);
    return split;
  }

}
