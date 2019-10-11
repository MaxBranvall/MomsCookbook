import { Component, OnInit } from '@angular/core';

import { Entry } from '../Models/Entry';
import { Ingredient } from '../Models/Ingredient';
import { Step } from '../Models/Step';
import { Tip } from '../Models/Tip';
import { Photo } from '../Models/Photo';
import { TouchSequence } from 'selenium-webdriver';


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

  public LocalSubStepID: number = 0;
  public localSubTipID: number = 0;

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
  subStepList:Step[] = [];
  stepModel = new Step(null, 0, '', this.subStepList)
  stepList:Step[] = [this.stepModel];

  subTipModel = new Tip(null, 0, '', null, null);
  subTipList:Tip[] = [];
  tipModel = new Tip(null, 0, '', this.subTipList);
  tipList: Tip[] = [this.tipModel];

  photoModel = new Photo(null, 0, '', '');
  additionalPhotoList: Photo[] = [this.photoModel];

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
    console.log(this.LocalStepID);
  }

  addSubTip() {
    this.subTipList.push(new Tip(null, this.LocalTipID, '', null, ++this.localSubTipID));
    this.tipList[this.LocalTipID].SubTips = this.subTipList;
  }

  addSubStep() {
    this.subStepList.push(new Step(null, this.LocalStepID, '', null, ++this.LocalSubStepID));
    this.stepList[this.LocalStepID].SubSteps = this.subStepList;
  }

  addTip() {
    this.tipList.push(new Tip(null, ++this.LocalTipID, null));
  }

  checkForSubItem(id1: number, id2: number) {
    if (id1 == id2) {
      return true;
    }
    return false;
  }


  get diagnostic() {
    return JSON.stringify(this.stepList);
  }

  photoPreview(files) {
    let reader = new FileReader();
    this.imagePath = files;
    console.log(this.imagePath[0]);
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
  }

}
