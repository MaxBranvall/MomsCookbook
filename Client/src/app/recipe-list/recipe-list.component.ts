import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Entry } from '../Models/Entry';

import { RecipeService } from '../Services/recipe.service';
import { TouchSequence } from 'selenium-webdriver';

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

  entries: Entry[];

  recipeSorted: boolean = false;
  prepTimeSorted: boolean = false;
  cookTimeSorted: boolean = false;
  reverseSort = false;
  orderByField="Name";

  model = new Entry("Breaded Chicken Cutlet",
  '../../assets/placeholders/recipeplaceholder.jpg', null, null, 0, 5, 1, 45, null, null, null);
  model2 = new Entry("Areaded Chicken Cutlet",
  '../../assets/placeholders/recipeplaceholder.jpg', null, null, 1, 30, 0, 20, null, null, null);

  // entries = [this.model, this.model2];

  getEntries() {
    this.entries = this.recipeService.getEntries();
    this.initTimes();
  }

  initTimes()
  {
    this.entries.forEach(e => {
      e.PrepTime = this.makeTime(e.PrepTimeH, e.PrepTimeM);
      e.CookTime = this.makeTime(e.CookTimeH, e.CookTimeM);
    });
  }

  makeTime(hour: number, minute: number) : string
  {
    return hour + ':' + minute;
  }

}
