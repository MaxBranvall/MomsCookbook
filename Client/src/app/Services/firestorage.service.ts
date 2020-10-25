import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';

import { finalize } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { FullRecipe } from '../Models/FullRecipe';

import { RecipeService } from './recipe.service';
import { PersistentdataService } from '../Services/persistentdata.service';


@Injectable({
  providedIn: 'root'
})
export class FireStorageService {

  constructor(private storage: AngularFireStorage, private recipeService: RecipeService, private router: Router,
              private persDataService: PersistentdataService) { }

  public downloadURL: Observable<string>;
  public uploadPercent$: Observable<number>;

  deleteImage(filePath: string) {
    const storageRef = this.storage.storage.refFromURL(filePath);

    storageRef.delete().then(
      res => {
        console.log('Firebase: Image deleted successfully!');
      }
    ).catch(
      err => {
        console.error('Firebase: Image not deleted..');
        throwError(`Firebase image not deleted.\nURL:\n${filePath}\n` +
        'Screenshot this screen and send it to Branflake for manual deletion.');
      }
    );
  }

  async uploadSingleFile(file: File, recipeID: number, entry: FullRecipe) {

    const basePath = '/Images/';

    const fileName = recipeID + '-' + 'mainImage';
    const filePath = basePath + fileName;
    const fileRef = this.storage.ref(filePath);

    const task = this.storage.upload(filePath, file);

    this.uploadPercent$ = task.percentageChanges();

    // Gets download URL, updates the entry in database with URL, sets entry as current, navigates to entry.

    await task.snapshotChanges().pipe(
      finalize(
        () => fileRef.getDownloadURL()
        .subscribe(
          res => {
            this.downloadURL = res;
            this.recipeService.addDownloadURL(res, recipeID).subscribe(
              d => {
                this.recipeService.getEntry(recipeID).subscribe(
                  resp => {
                    this.goToNewEntry(resp.body);
                  }
                );
              }
            );
          }
        )
      )
    ).subscribe();
  }

  private goToNewEntry(recipe: FullRecipe) {
    this.persDataService.setCurrentRecipe(recipe);
    this.router.navigateByUrl('/' + recipe.Category + '/' +  recipe.RecipeID + '/' + recipe.Name);
  }

  private getDateTimeString(): string {
    const date = new Date();
    const formattedDate = date.getFullYear() + '-' + (date.getMonth() + 1).toString() + '-' + date.getDate();
    const formattedTime = date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();

    return formattedDate + '-' + formattedTime;

  }

}
