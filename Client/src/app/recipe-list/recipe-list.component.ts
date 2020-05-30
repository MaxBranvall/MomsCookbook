import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RecipeService } from '../Services/recipe.service';
import { PersistentdataService } from '../Services/persistentdata.service';
import { FullRecipe } from '../Models/FullRecipe';
import { LocalStorageItem } from '../_helpers/local-storage-item.enum';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {

  title: string;
  entries: FullRecipe[] = [];

  noEntries = false;
  loading = false;

  recipeSorted = false;
  prepTimeSorted = false;
  cookTimeSorted = false;
  reverseSort = false;
  orderByField = 'Name';

  constructor(
    private route: ActivatedRoute, private recipeService: RecipeService,
    private router: Router, private persDataService: PersistentdataService
    ) { }

  ngOnInit() {
    localStorage.removeItem(LocalStorageItem.CurrentRecipe);
    this.title = this.route.snapshot.paramMap.get('categoryTitle').toString();
    this.getEntries();
  }

  public onSelect(recipe: FullRecipe) {
    this.persDataService.setCurrentRecipe(recipe);
    this.router.navigateByUrl('/' + this.title + '/' + recipe.Name);
  }

  async getEntries() {

    this.loading = true;

    this.recipeService.getAllEntriesByCategory(this.title).subscribe(
      res => {
        this.loading = false;
        if (res.status === 0) {
          this.noEntries = true;
        } else {
          this.entries = res.body;
        }
      }
      );
     }
  }
