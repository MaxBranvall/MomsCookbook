import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
import { NgModel } from '@angular/forms';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
import { FindValueSubscriber } from 'rxjs/internal/operators/find';

@Component({
  selector: 'app-recipe-entry',
  templateUrl: './recipe-entry.component.html',
  styleUrls: ['./recipe-entry.component.scss']
})
export class RecipeEntryComponent implements OnInit {

  constructor(private recipeService: RecipeService, public storageService: FireStorageService, private router: Router,
              private persDataService: PersistentdataService, private route: ActivatedRoute) {}

  get diagnostic() {
    return JSON.stringify(this.model);
  }

  categories = categories;
  public mode = 'newentry';

  public quantityAlert = false;
  public unitAlert = false;
  public categoryAlert = false;
  public timeAlert = false;
  public globalAlert = false;

  public imagePath;
  public imgURL: any;
  public mainImage: File;

  public uploadPercent: Observable<number>;
  public downloadURL: Observable<string>;
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
    '--Select Unit--', '----', 'pinch(s)', 'teaspoon(s)', 'tablespoon(s)',
    'cup(s)', 'glob(s)', 'stick(s)', 'pint(s)'
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

  currentRecipe: FullRecipe;

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
    this.route.data.subscribe(
      x => {
      this.mode = JSON.parse(JSON.stringify(x['mode']));
      if (this.mode === 'editing') {
        this.currentRecipe = JSON.parse(localStorage.getItem('currentRecipe'));
        this.model = this.currentRecipe;
        console.log(JSON.stringify(this.model));
      };
      }
    );

  }

  // cleanUpModel()
  // {
    // this.cleanUpSteps();
  //   this.cleanUpTips();
  // }

  showModel() {
    console.log(JSON.stringify(this.model));
  }

  async onSubmit() {

    this.setCreationTime();
    this.formatTimes();
    this.clearEmptyElements();

    /*
      If there is an image, call firestorage service to handle upload.
      If not, handle tasks such as routing here.
      TODO: neaten this up, don't do so much all in one spot.
    */

    if (this.validateModel()) {

      this.globalAlert = false;

      if (this.mainImage !== undefined) {
        this.submitWithImage();
      } else {
        this.submitWithoutImage();
      }

    } else {
      this.globalAlert = true;
    }
  }

  async submitWithImage() {
    this.Image = true;
    this.localLoading = true;
    await this.recipeService.addRecipe(this.model).toPromise().then(recipe => this.RecipeID = recipe.RecipeID);
    this.storageService.uploadSingleFile(this.mainImage, this.RecipeID, this.model);
  }

  async submitWithoutImage() {
    this.Image = false;
    this.localLoading = true;
    await this.recipeService.addRecipe(this.model).toPromise().then(recipe => this.RecipeID = recipe.RecipeID);
    console.log(this.RecipeID);
    await this.recipeService.getEntry(this.RecipeID).toPromise().then(
      res => {
        this.persDataService.setCurrentRecipe(res.body);
        this.navigateToNewEntry(this.model.Category, this.model.Name);
      }
    );
  }

  navigateToNewEntry(category: string, name: string) {
    this.localLoading = false;
    this.router.navigateByUrl('/' + category + '/' + name);
  }

  clearEmptyElements() {
    this.model.Steps.forEach(step => {
        if (this.isEmptyOrNull(step.Contents)) {
          this.model.Steps.splice(this.model.Steps.indexOf(step));
        }
      });

    this.model.SubSteps.forEach(subStep => {
      if (this.isEmptyOrNull(subStep.Contents)) {
        this.model.SubSteps.splice(this.model.SubSteps.indexOf(subStep));
      }
    });

    this.model.Tips.forEach(tip => {
      if (this.isEmptyOrNull(tip.Contents)) {
        this.model.Tips.splice(this.model.Tips.indexOf(tip));
      }
    });

    this.model.SubTips.forEach(subTip => {
      if (this.isEmptyOrNull(subTip.Contents)) {
        this.model.SubTips.splice(this.model.SubTips.indexOf(subTip));
      }
    });

    this.model.Ingredients.forEach(ingredient => {
      if (this.isEmptyOrNull(ingredient.Contents)) {
        this.model.Ingredients.splice(this.model.Ingredients.indexOf(ingredient));
      }
    });
  }

  validateModel() {

    const ingredients = this.validateIngredients();
    const category = this.validateCategory();
    const times = this.validateTimes();

    if (ingredients && category && times) {
      return true;
    } else {
      return false;
    }

  }

  validateTimes() {
    if (this.model.PrepTimeH === null || this.model.PrepTimeM === null ||
       this.model.CookTimeH === null || this.model.CookTimeM === null) {
      this.timeAlert = true;
      return false;
    } else {
      this.timeAlert = false;
      return true;
    }
  }

  validateCategory() {
    if (this.model.Category === this.categories[0].title) {
      this.categoryAlert = true;
      return false;
    } else {
      this.categoryAlert = false;
      return true;
    }
  }

  validateIngredients() {

    const isNotNull = (quantity) => quantity !== null;
    const isValid = (unit) => unit !== this.units[0];

    if (this.model.Ingredients.every(ingredient => isNotNull(ingredient.Quantity))) {
      this.quantityAlert = false;
    } else {
      this.quantityAlert = true;
    }

    if (this.model.Ingredients.every(ingredient => isValid(ingredient.Unit))) {
      this.unitAlert = false;
    } else {
      this.unitAlert = true;
    }

    if (this.unitAlert === false && this.quantityAlert === false) {
      return true;
    } else {
      return false;
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
