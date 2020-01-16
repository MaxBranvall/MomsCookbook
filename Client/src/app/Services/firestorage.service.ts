import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';

import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
  public loading = false;

  async uploadSingleFile(file: File, recipeID: number, entry: FullRecipe) {

    this.loading = true;

    const basePath = '/Images/';

    const fileName = recipeID + '-' + this.getDateTimeString() + '-' + file.name;
    const filePath = basePath + fileName;
    const fileRef = this.storage.ref(filePath);

    const task = this.storage.upload(filePath, file);

    this.uploadPercent$ = task.percentageChanges();

    await task.snapshotChanges().pipe(
      finalize(
      () => fileRef.getDownloadURL()
      .subscribe(res => {
        this.downloadURL = res;
        this.recipeService.addDownloadURL(res, recipeID)
         .subscribe(() => {
           // TODO: Instead of entry.Name, call metod in recipe service to get entry by ID from database
           this.SetRecipe(recipeID);
           setTimeout(() => { this.loading = false;
                              this.router.navigateByUrl('/' + entry.Category + '/' + entry.Name); }, 1000);
          });
      }))
    ).subscribe();
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
