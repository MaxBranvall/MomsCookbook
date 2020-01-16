import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FullRecipe } from '../Models/FullRecipe';
import { Ingredient } from '../Models/Ingredient';
import { Step } from '../Models/Step';
import { Tip } from '../Models/Tip';
import { Photo } from '../Models/Photo';
import { categories } from '../Models/categories';

import { Observable } from 'rxjs';

import { RecipeService } from '../Services/recipe.service';
import { FireStorageService } from '../Services/firestorage.service';
import { PersistentdataService } from '../Services/persistentdata.service';

@Component({
  selector: 'app-recipe-entry',
  templateUrl: './recipe-entry.component.html',
  styleUrls: ['./recipe-entry.component.scss']
})
export class RecipeEntryComponent implements OnInit {

  constructor(private recipeService: RecipeService, public storageService: FireStorageService, private router: Router,
              private persDataService: PersistentdataService) {}

  get diagnostic() {
    return JSON.stringify(this.model);
  }

  categories = categories;

  public imagePath;
  public imgURL: any;
  public mainImage: File;

  public uploadPercent: Observable<number>;
  public downloadURL: Observable<string>;
  public loading: boolean = this.storageService.loading;
  public localLoading = false;

  public submitted = false;

  public fileSelected = false;
  public additionalPhotosSelected = false;

  public LocalIngredientID = 0;
  public LocalStepID = 0;
  public LocalTipID = 0;

  public LocalSubStepID = 0;
  public localSubTipID = 0;

  public currentStepElement: number = null;
  public currentTipElement: number = null;

  public RecipeID = 1;
  public Image = false;

  additionalPhotoPreview: any[] = [];

  units: string[] = [
    '--Select Unit--', 'pinch(s)', 'teaspoon(s)', 'tablespoon(s)',
    'cup(s)',
    'glob(s)'
  ];

  ingredientModel = new Ingredient(
    this.RecipeID, 0, null,
    null, this.units[0]
  );
  ingredientList: Ingredient[] = [this.ingredientModel];

  subStepModel = new Step(this.RecipeID, 0, null, null);
  subStepList: Step[] = [];
  stepModel = new Step(this.RecipeID, 0, null);
  stepList: Step[] = [this.stepModel];

  subTipModel = new Tip(this.RecipeID, 0, null, null);
  subTipList: Tip[] = [];
  tipModel = new Tip(this.RecipeID, 0, null);
  tipList: Tip[] = [this.tipModel];

  photoModel = new Photo(null, null);
  additionalPhotoList: Photo[] = [];

  fileList: File[] = [];

  model = new FullRecipe(
    this.RecipeID,
    null,
    null,
    null,
    this.categories[0].title,
    null,
    null,
    null,
    null,
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

  ngOnInit() {
  }

  // cleanUpModel()
  // {
  //   this.cleanUpSteps();
  //   this.cleanUpTips();
  // }

  async onSubmit() {

    this.setCreationTime();
    this.formatTimes();

    // this.cleanUpModel();

    // await this.recipeService.addRecipe(this.model).toPromise().then(recipe => this.RecipeID = recipe.RecipeID);
    // this.localLoading = true;
    // this.persDataService.setCurrentRecipe(await this.recipeService.getEntry(this.RecipeID).toPromise());
    // this.persDataService.currentRecipe = await this.recipeService.getEntry(this.RecipeID).toPromise();
    // setTimeout(() => {
    //   this.localLoading = false;
    //   this.router.navigateByUrl('/' + this.model.Category + '/' + this.model.Name);
    // }, 1000);
    /*
      If there is an image, call firestorage service to handle upload.
      If not, handle tasks such as routing here.
      TODO: neaten this up, don't do so much all in one spot.
    */

    if (this.mainImage !== undefined) {
      this.Image = true;
      await this.recipeService.addRecipe(this.model).toPromise().then(recipe => this.RecipeID = recipe.RecipeID);
      this.storageService.uploadSingleFile(this.mainImage, this.RecipeID, this.model);

    } else {
      this.Image = false;
      await this.recipeService.addRecipe(this.model).toPromise().then(recipe => this.RecipeID = recipe.RecipeID);
      console.log(this.RecipeID);
      this.localLoading = true;
      this.persDataService.setCurrentRecipe( await this.recipeService.getEntry(this.RecipeID).toPromise().then());
      // this.persDataService.currentRecipe = await this.recipeService.getEntry(this.RecipeID).toPromise().then();
      setTimeout(() => {
        this.localLoading = false;
        this.router.navigateByUrl('/' + this.model.Category + '/' + this.model.Name);
      }, 1000);
    }
  }

  async addRecipe() {
    return await this.recipeService.addRecipe(this.model);
  }

  isEmptyOrNull(s: any) {
    if (s === null || s === undefined || s === '') {
      return true;
    }
    return false;
  }

  setCreationTime() {
    if (this.isEmptyOrNull(this.model.Created)) {
      this.model.Created = new Date().getTime();
    }

    this.model.LastModified = new Date().getTime();

  }

  formatTimes() {
    this.model.PrepTime = this.model.PrepTimeH + ':' + this.model.PrepTimeM;
    this.model.CookTime = this.model.CookTimeH + ':' + this.model.CookTimeM;
  }

  addIngredient() {
    this.ingredientList.push(new Ingredient(this.RecipeID, ++this.LocalIngredientID, '', null, this.units[0]));
  }

  addStep() {
    this.stepList.push(new Step(this.RecipeID, ++this.LocalStepID, null));
  }

  addSubStep(index?: number) {

    const i = +index;
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

    const i = +index;
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

    if (subTipLocalID === mainTipLocalID) {
      return true;
    }
    return false;
  }

  photoPreview(files) {
    this.mainImage = files[0];
    // this.model.Image.File = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      this.imgURL = reader.result;
    };
  }

  additionalPhotoRender(files) {
    for (const f of  files) {
      const reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = (event) => {
        this.additionalPhotoPreview.push(reader.result);
        console.log(reader.result);
      };
    }
  }

}
