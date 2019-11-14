import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

import { RecipeService } from './recipe.service';

import { finalize, tap, flatMap } from "rxjs/operators";
import { Observable, from } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FireStorageService {

  constructor(private storage: AngularFireStorage, private recipeService: RecipeService) { }

  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  loading: boolean = true;

  async uploadSingleFile(file: File, recipeID: number)
  {
    const basePath = "/Images/"

    let fileName = recipeID + "-" + this.getDateTimeString() + "-" + file.name;
    let filePath = basePath + fileName;
    let fileRef = this.storage.ref(filePath);

    let task = this.storage.upload(filePath, file);

    this.uploadPercent = task.percentageChanges();

    // await task.snapshotChanges().pipe(
    //   finalize(
    //     () =>
    //   )
    // )

    await task.snapshotChanges().pipe(
      finalize(
      () => fileRef.getDownloadURL()
      .subscribe(res => {
        this.downloadURL = res;
         this.recipeService.addDownloadURL(res, recipeID)
         .subscribe((res : any) => {
           this.loading = false;
          });
      }))
    ).subscribe();

    // console.log(fileName);
    // console.log(this.downloadURL);
    // console.log(this.uploadPercent);
  }

  private getDateTimeString(): string
  {
    let date = new Date();
    let formattedDate = date.getFullYear() + "-" + (date.getMonth() + 1).toString() + "-" + date.getDate();
    let formattedTime = date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds();

    return formattedDate + "-" + formattedTime;

  }

}
