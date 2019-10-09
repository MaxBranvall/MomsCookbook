import { Component, OnInit } from '@angular/core';

import { Entry } from '../Models/Entry';
import { Ingredient } from '../Models/Ingredient';
import { Step } from '../Models/Step';
import { Tip } from '../Models/Tip';


@Component({
  selector: 'app-recipe-entry',
  templateUrl: './recipe-entry.component.html',
  styleUrls: ['./recipe-entry.component.scss']
})
export class RecipeEntryComponent implements OnInit {

  public imagePath;
  public imgURL: any;

  constructor() {}

  ngOnInit() {
  }

  ingredientList:Ingredient[] = [];
  stepList:Step[] = [];
  tipList: Tip[] = [];
  additionalPhotoList: string[] = [];

  model = new Entry(
    "", "", "",
    0, 0, 0, 0,
    this.ingredientList,
    this.stepList, this.tipList,
    this.additionalPhotoList
    );

    get diagnostic() {
      return JSON.stringify(this.model);
    }

    preview(files) {
      let reader = new FileReader();
      this.imagePath = files;
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        console.log(this.imgURL);
        this.imgURL = reader.result;
      }
    }

}
