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

@Component({
  selector: 'app-recipe-entry',
  templateUrl: './recipe-entry.component.html',
  styleUrls: ['./recipe-entry.component.scss']
})
export class RecipeEntryComponent implements OnInit {

  constructor(private recipeService: RecipeService, public storageService: FireStorageService, private router: Router,
              private persDataService: PersistentdataService, private route: ActivatedRoute) {}

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
  public imageChanged = false;

  public uploadPercent: Observable<number>;
  public downloadURL: Observable<string>;
  public localLoading = false;

  public submitted = false;

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
        this.mode = JSON.parse(JSON.stringify(x.mode));
        if (this.mode === 'editing') {
          this.currentRecipe = this.persDataService.getCurrentRecipe();
          this.initialize();
        }
        if (this.persDataService.getPendingRecipe() !== null) {
          this.currentRecipe = this.persDataService.getPendingRecipe();
          this.initialize();
        }
      }
    );

  }

  private initialize() {
    this.RecipeID = this.currentRecipe.RecipeID;
    this.model = this.currentRecipe;
    this.imgURL = this.currentRecipe.ImagePath;
    if (this.model.Steps.length > 0) {
      this.LocalStepID = this.model.Steps[this.model.Steps.length - 1].LocalStepID;
    }
    if (this.model.SubSteps.length > 0) {
      this.LocalSubStepID = this.model.SubSteps[this.model.SubSteps.length - 1].SubStepID;
    }
    if (this.model.Tips.length > 0) {
      this.LocalTipID = this.model.Tips[this.model.Tips.length - 1].LocalTipID;
    }
    if (this.model.SubTips.length > 0) {
      this.localSubTipID = this.model.SubTips[this.model.SubTips.length - 1].SubTipID;
    }
    if (this.model.Ingredients.length > 0) {
      this.LocalIngredientID = this.model.Ingredients[this.model.Ingredients.length - 1].LocalIngredientID;
    }
  }

  get diagnostic() {
    return JSON.stringify(this.model.SubSteps);
  }

  async onSubmit() {

    this.setCreationTime();
    this.formatTimes();
    this.clearEmptyElements();

    if (this.validateModel()) {

      this.globalAlert = false;
      this.persDataService.setPendingRecipe(this.model);

      if (this.mainImage !== undefined) {
        this.submitWithImage();
      } else {
        this.model.ImagePath = this.imgURL;
        this.submitWithoutImage();
      }

    } else {
      this.globalAlert = true;
    }
  }

  async submitWithImage() {
    this.Image = true;
    this.localLoading = true;

    if (this.mode === 'editing') {
      this.recipeService.updateRecipe(this.model).subscribe(
        recipe => {
          this.RecipeID = recipe.RecipeID;
          this.persDataService.setPendingRecipe(null);
          this.storageService.uploadSingleFile(this.mainImage, this.RecipeID, this.model);
        }, error => {
          this.localLoading = false;
          this._handleSubmitError(error);
        }
      );
    } else {
      this.recipeService.addRecipe(this.model).subscribe(
        recipe => {
          this.RecipeID = recipe.body.RecipeID;
          this.persDataService.setPendingRecipe(null);
          this.storageService.uploadSingleFile(this.mainImage, this.RecipeID, this.model);
        }, error => {
          this.localLoading = false;
          this._handleSubmitError(error);
        }
      );
    }
  }

  async submitWithoutImage() {
    this.Image = false;
    this.localLoading = true;

    if (this.mode === 'editing') {
      this.recipeService.updateRecipe(this.model).subscribe(
        result => {
          this.RecipeID = result.RecipeID;
          this.persDataService.setPendingRecipe(null);
          this.recipeService.getEntry(this.RecipeID).subscribe(
            recipe => {
              this.persDataService.setCurrentRecipe(recipe.body);
              this.navigateToNewEntry(this.model.Category, this.model.Name);
            }
          );
        }, error => {
          this.localLoading = false;
          this._handleSubmitError(error);
        }
      );
    } else  {
      this.recipeService.addRecipe(this.model).subscribe(
        result => {
          this.RecipeID = result.body.RecipeID;
          this.persDataService.setPendingRecipe(null);
          this.recipeService.getEntry(this.RecipeID).subscribe(
            recipe => {
              this.persDataService.setCurrentRecipe(recipe.body);
              this.navigateToNewEntry(this.model.Category, this.model.Name);
            }
          );
        }, error => {
          this.localLoading = false;
          this._handleSubmitError(error);
        }
      );
    }
  }

  private _handleSubmitError(error: any): void {
    console.error(error);
    alert('There was an error submitting your recipe '  + this.model.Name +
           '. Your recipe was saved and will be filled in the next time you come to this page.' +
           '\nNote: If your recipe included an image, you will have to reselect your image.' +
           '\n\nError Details: \nStatus: ' + error.status + '\nMessage: ' + error.message);
  }

  navigateToNewEntry(category: string, name: string) {
    this.localLoading = false;
    this.router.navigateByUrl('/' + category + '/' + name);
  }

  clearEmptyElements() {
    this.model.Steps.forEach(step => {
        if (this.isEmptyOrNull(step.Contents)) {
          this.model.Steps.splice(this.model.Steps.indexOf(step), 1);
        }
      });

    this.model.SubSteps.forEach(subStep => {
      if (this.isEmptyOrNull(subStep.Contents)) {
        this.model.SubSteps.splice(this.model.SubSteps.indexOf(subStep), 1);
      }
    });

    this.model.Tips.forEach(tip => {
      if (this.isEmptyOrNull(tip.Contents)) {
        this.model.Tips.splice(this.model.Tips.indexOf(tip), 1);
      }
    });

    this.model.SubTips.forEach(subTip => {
      if (this.isEmptyOrNull(subTip.Contents)) {
        this.model.SubTips.splice(this.model.SubTips.indexOf(subTip), 1);
      }
    });

    this.model.Ingredients.forEach(ingredient => {
      if (this.isEmptyOrNull(ingredient.Contents)) {
        this.model.Ingredients.splice(this.model.Ingredients.indexOf(ingredient), 1);
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
    this.model.Ingredients.push(new Ingredient(this.RecipeID, ++this.LocalIngredientID, '', null, this.units[0]));
  }

  addStep() {
    this.model.Steps.push(new Step(this.RecipeID, ++this.LocalStepID, ''));
  }

  addSubStep(index?: number) {
    const i = +index;
    console.log(this.LocalSubStepID.toString());
    this.model.SubSteps.push(new Step(this.RecipeID, i, '', ++this.LocalSubStepID));
  }

  addTip() {
    this.model.Tips.push(new Tip(this.RecipeID, ++this.LocalTipID, null));
  }

  addSubTip(index?: number) {
    const i = +index;
    this.model.SubTips.push(new Tip(this.RecipeID, i, null, ++this.localSubTipID));
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
