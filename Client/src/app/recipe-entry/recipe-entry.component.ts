import { Component, OnInit } from '@angular/core';

import { Entry } from '../Models/Entry';
import { Ingredient } from '../Models/Ingredient';
import { Step } from '../Models/Step';
import { Tip } from '../Models/Tip';
import { RouterLinkWithHref } from '@angular/router';


@Component({
  selector: 'app-recipe-entry',
  templateUrl: './recipe-entry.component.html',
  styleUrls: ['./recipe-entry.component.scss']
})
export class RecipeEntryComponent implements OnInit {

  public imagePath;
  public imgURL: any;

  public LocalIngredientID: number = 0;
  public LocalStepID: number = 0;
  public LocalTipID: number = 0;

  constructor() {}

  ngOnInit() {
  }

  units:string[] = [
    "--Select Unit--", "cup(s)", "tablespoon(s)", "teaspoon(s)",
    "quart(s)", "pinch(es)", "glob(s)"
  ]

  ingredientModel = new Ingredient(
    null, 0, '',
    null, this.units[0]
  );
  ingredientList:Ingredient[] = [this.ingredientModel];

  subStepModel = new Step(null, 0, '', null, null);
  subStepList:Step[] = [this.subStepModel]
  stepModel = new Step(null, 0, '', this.subStepList)
  stepList:Step[] = [this.stepModel];

  subTipModel = new Tip(null, 0, '', null, null);
  subTipList:Tip[] = [this.subTipModel];
  tipModel = new Tip(null, 0, '', this.subTipList);
  tipList: Tip[] = [this.tipModel];

  additionalPhotoList: string[] = [];

  model = new Entry(
    "", "", "",
    null, null, null, null,
    this.ingredientList,
    this.stepList, this.tipList,
    this.additionalPhotoList
  );

  addIngredient() {
    this.ingredientList.push(new Ingredient(null,++this.LocalIngredientID,'',null,this.units[0]));
  }

  addStep() {
    this.stepList.push(new Step(null, ++this.LocalStepID, null))
  }

  addTip() {
    this.tipList.push(new Tip(null, ++this.LocalTipID, null));
  }

  get diagnostic() {
    return JSON.stringify(this.ingredientList);
  }

  photoPreview(files) {
    let reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      console.log(this.imgURL);
      this.imgURL = reader.result;
    }
  }

}
