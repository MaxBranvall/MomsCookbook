import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap, map} from 'rxjs/operators';

import { Entry } from '../Models/Entry';

import { RecipeService } from '../Services/recipe.service';


@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {

  constructor(private route: ActivatedRoute, private recipeService: RecipeService) { }

  ngOnInit() {
    this.title = this.route.snapshot.paramMap.get('categoryTitle').toString();
    this.getEntries();
  }

  title;
  entries: Entry[] = [];
  testing: any[] = [];

  timeInitialized: boolean = false;

  recipeSorted: boolean = false;
  prepTimeSorted: boolean = false;
  cookTimeSorted: boolean = false;
  reverseSort = false;
  orderByField="Name";

  getEntries() {
    this.recipeService.getAllEntries()
    .subscribe(entries => this.entries = entries);
  }

  initTimes()
  {

    if (this.timeInitialized)
    {
      return;
    }

    this.entries.forEach(e => {
      e.PrepTime = this.formatTimes(e.PrepTimeH, e.PrepTimeM);
      e.CookTime = this.formatTimes(e.CookTimeH, e.CookTimeM);
      console.log("Initialized times for " + e.Name + ".");
    });

    this.timeInitialized = true;

  }

  formatTimes(hour: number, minute: number) : string
  {
    return hour + ':' + minute;
  }

}
