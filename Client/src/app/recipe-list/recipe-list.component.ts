import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap, map} from 'rxjs/operators';

import { Entry } from '../Models/Entry';
import { Photo } from '../Models/Photo';
import { Recipe } from '../Models/Recipe';

import { RecipeService } from '../Services/recipe.service';
import { DomSanitizer } from '@angular/platform-browser';
import { JsonPipe } from '@angular/common';


@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {

  constructor(private route: ActivatedRoute, private recipeService: RecipeService,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.title = this.route.snapshot.paramMap.get('categoryTitle').toString();
    this.getEntries();
  }

  title;
  entries: Recipe[] = [];

  timeInitialized: boolean = false;

  recipeSorted: boolean = false;
  prepTimeSorted: boolean = false;
  cookTimeSorted: boolean = false;
  reverseSort = false;
  orderByField="Name";

  model = new Entry(
    null,
    "test",
    null,
    "1",
    null,
    1,
    1,
    1,
    1,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  );

  public sanitizeUrl(url : string)
  {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  getEntries() {

    // Need to reformat preptimeh preptimem cooktimeh cooktimem since db
    // only holds the formatted prep and cook times.

    this.recipeService.getAllEntries()
    .subscribe(entries => this.entries = entries, res => console.log(res));
  }

  img: any = null;

  photoPreview(files) {
    // this.model.Image.File = files[0];
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      return reader.result;
    }
  }

  get diagnostic()
  {
    return JSON.stringify(this.entries);
  }

  // initTimes()
  // {

  //   if (this.timeInitialized)
  //   {
  //     return;
  //   }

  //   this.entries.forEach(e => {
  //     e.PrepTime = this.formatTimes(e.PrepTimeH, e.PrepTimeM);
  //     e.CookTime = this.formatTimes(e.CookTimeH, e.CookTimeM);
  //     console.log("Initialized times for " + e.Name + ".");
  //   });

  //   this.timeInitialized = true;

  // }

  formatTimes(hour: number, minute: number) : string
  {
    return hour + ':' + minute;
  }

}
