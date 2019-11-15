import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

import { RecipeService } from './recipe.service';

import { finalize, tap, flatMap } from 'rxjs/operators';
import { Observable, from } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FireStorageService {

  constructor(private storage: AngularFireStorage, private recipeService: RecipeService) { }

  downloadURL: Observable<string>;
  public uploadPercent$: Observable<number>;
  public loading = true;

  async uploadSingleFile(file: File, recipeID: number) {
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
           this.loading = false;
          });
      }))
    ).subscribe();

    // console.log(fileName);
    // console.log(this.downloadURL);
    // console.log(this.uploadPercent);
  }

  private getDateTimeString(): string {
    const date = new Date();
    const formattedDate = date.getFullYear() + '-' + (date.getMonth() + 1).toString() + '-' + date.getDate();
    const formattedTime = date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();

    return formattedDate + '-' + formattedTime;

  }

}
