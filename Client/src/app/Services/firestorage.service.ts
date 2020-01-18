import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';

import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { FullRecipe } from '../Models/FullRecipe';

import { RecipeService } from './recipe.service';
import { PersistentdataService } from '../Services/persistentdata.service';
import { TouchSequence } from 'selenium-webdriver';


@Injectable({
  providedIn: 'root'
})
export class FireStorageService {

  constructor(private storage: AngularFireStorage, private recipeService: RecipeService, private router: Router,
    private persDataService: PersistentdataService) { }

  public downloadURL: Observable<string>;
  public uploadPercent$: Observable<number>;
  public loading = false;

  async uploadSingleFile(file: File, recipeID: number, entry: FullRecipe) {

    this.loading = true;

    const basePath = '/Images/';

    const fileName = recipeID + '-' + this.getDateTimeString() + '-' + file.name;
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
            this.recipeService.addDownloadURL(res, recipeID).toPromise().then(
              () =>
              this.recipeService.getEntry(recipeID).toPromise().then(
                r => {
                  this.persDataService.setCurrentRecipe(r.body);
                  this.loading = false;
                  this.router.navigateByUrl('/' + entry.Category + '/' + entry.Name);
                }
              )
            );
          }
        )
      )
    ).subscribe();

    // await task.snapshotChanges().pipe(
    //   finalize(
    //   () => fileRef.getDownloadURL()
    //   .subscribe(res => {
    //     this.downloadURL = res;
    //     this.recipeService.addDownloadURL(res, recipeID).toPromise().then(
    //       () =>
    //       this.recipeService.getEntry(recipeID).toPromise().then(
    //         r => {
    //           this.persDataService.setCurrentRecipe(r.body);
    //           this.loading = false;
    //           this.router.navigateByUrl('/' + entry.Category + '/' + entry.Name);
    //             }
    //           )
    //         );
    //       }
    //     )
    //   }))
    // ).subscribe();
  }

  async SetRecipe(recipeID: number) {
    this.persDataService.setCurrentRecipe(await this.recipeService.getEntry(recipeID).toPromise().then());
  }

  private getDateTimeString(): string {
    const date = new Date();
    const formattedDate = date.getFullYear() + '-' + (date.getMonth() + 1).toString() + '-' + date.getDate();
    const formattedTime = date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();

    return formattedDate + '-' + formattedTime;

  }

}
