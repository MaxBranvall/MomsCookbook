import { Component, OnInit } from '@angular/core';

import { Entry } from '../Models/Entry';
import { Ingredient } from '../Models/Ingredient';
import { Step } from '../Models/Step';
import { Tip } from '../Models/Tip';
import { Photo } from '../Models/Photo';
import { RecipeService } from '../Services/recipe.service';
import { NgModel } from '@angular/forms';
import { pipe } from 'rxjs';
import { tap, map} from 'rxjs/operators';
import { Testing } from '../Models/Testing';


@Component({
  selector: 'app-recipe-entry',
  templateUrl: './recipe-entry.component.html',
  styleUrls: ['./recipe-entry.component.scss']
})
export class RecipeEntryComponent implements OnInit {

  public imagePath;
  public imgURL: any;
  public mainImage: File;

  public submitted: boolean = false;

  public fileSelected: boolean = false;
  public additionalPhotosSelected: boolean = false;

  public LocalIngredientID: number = 0;
  public LocalStepID: number = 0;
  public LocalTipID: number = 0;

  public LocalSubStepID: number = 0;
  public localSubTipID: number = 0;

  public currentStepElement: number = null;
  public currentTipElement: number = null;

  public RecipeID: number = 1;

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
  }

  additionalPhotoPreview: any[] = [];

  units:string[] = [
    "--Select Unit--", "pinch(s)", "teaspoon(s)", "tablespoon(s)",
    "cup(s)",
    "glob(s)"
  ]

  categories:string[] = [
    "--Select Unit--","Breakfast", "Lunch", "Dinner",
     "Appetizer", "Side"
  ];

  ingredientModel = new Ingredient(
    this.RecipeID, 0, 't',
    1, this.units[0]
  );
  ingredientList:Ingredient[] = [this.ingredientModel, new Ingredient(this.RecipeID, ++this.LocalIngredientID, 'y', 3, this.units[2])];

  subStepModel = new Step(this.RecipeID, 0, 't', null);
  subStepList:Step[] = [];
  stepModel = new Step(this.RecipeID, 0, 't')
  stepList:Step[] = [this.stepModel];

  subTipModel = new Tip(this.RecipeID, 0, 't', null);
  subTipList:Tip[] = [];
  tipModel = new Tip(this.RecipeID, 0, 't');
  tipList: Tip[] = [this.tipModel];

  photoModel = new Photo(null, null);
  additionalPhotoList: Photo[] = [];

  fileList: File[] = [];

  t = new Testing(this.RecipeID, this.fileList, '');

  model = new Entry(
    this.RecipeID,
    "test",
    new Photo(this.RecipeID, null),
    "1",
    this.categories[0],
    1,
    1,
    1,
    1,
    this.ingredientList,
    this.stepList,
    this.subStepList,
    this.tipList,
    this.subTipList,
    this.fileList,
    this.additionalPhotoList,
    null,
    null,
    null,
    null,
  );

  // cleanUpModel()
  // {
  //   this.cleanUpSteps();
  //   this.cleanUpTips();
  // }

  async onSubmit()
  {

    this.setCreationTime();
    this.formatTimes();

    // this.cleanUpModel();

    await this.recipeService.addRecipe(this.model).toPromise().then(id => this.RecipeID = id);
    console.log(this.RecipeID);
    await this.recipeService.addPhoto(this.mainImage, this.RecipeID.toString()).subscribe
    (res => console.log(res));

  }

  async addRecipe() {
    return await this.recipeService.addRecipe(this.model).toPromise();
  }

  isEmptyOrNull(s: any)
  {
    if (s == null || s == undefined || s == '')
    {
      return true;
    }
    return false;
  }

  setCreationTime()
  {
    if (this.isEmptyOrNull(this.model.Created))
    {
      this.model.Created = new Date().getTime();
    }

    this.model.LastModified = new Date().getTime();

  }

  formatTimes()
  {
    this.model.PrepTime = this.model.PrepTimeH + ":" + this.model.PrepTimeM;
    this.model.CookTime = this.model.CookTimeH + ":" + this.model.CookTimeM;
  }

  addIngredient() {
    this.ingredientList.push(new Ingredient(this.RecipeID,++this.LocalIngredientID,'',null,this.units[0]));
  }

  addStep() {
    this.stepList.push(new Step(this.RecipeID, ++this.LocalStepID, null))
  }

  addSubStep(index?: number) {

    var i = +index;
    console.log(typeof(i));

    this.subStepList.push(new Step(this.RecipeID, i, '', ++this.LocalSubStepID));
    // if (index != undefined)
    // {
    //   this.subStepList.push(new Step(this.RecipeID, index, '', null, ++this.LocalSubStepID));
    //   this.stepList[index].SubSteps = this.subStepList;
    // }
    // else
    // {
    //   this.subStepList.push(new Step(this.RecipeID, this.LocalStepID, '', null, ++this.LocalSubStepID));
    //   this.stepList[this.LocalStepID].SubSteps = this.subStepList;
    // }
  }

  addTip() {
    this.tipList.push(new Tip(this.RecipeID, ++this.LocalTipID, null));
  }

  addSubTip(index?: number) {

    var i = +index;
    console.log(typeof(i));
    console.log(i);

    this.subTipList.push(new Tip(this.RecipeID, i, '', ++this.localSubTipID));
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

  photoPreview(files) {
    this.mainImage = files[0];
    // this.model.Image.File = files[0];
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
  }

  additionalPhotoRender(files) {
    for (let i = 0; i < files.length; i++)
    {
      let reader = new FileReader();
      reader.readAsDataURL(files[i]);
      reader.onload = (_event) => {
        this.additionalPhotoPreview.push(reader.result);
        console.log(reader.result);
      }
    }
  }

  get diagnostic() {
    return JSON.stringify(this.t.f);
  }

}
