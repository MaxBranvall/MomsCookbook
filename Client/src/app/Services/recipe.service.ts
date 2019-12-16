import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { FullRecipe } from '../Models/FullRecipe';
import { Recipe } from '../Models/Recipe';
import { FirebaseURL } from '../Models/FirebaseURL';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private apiURL = environment.apiURL;

  constructor(
    private http: HttpClient,
  ) { }

  getAllEntries(): Observable<Recipe[]> {
    /*
      Gets all recipes meta info from database.
     */
    return this.http.get<Recipe[]>(this.apiURL + 'Recipes');
  }

  getAllEntriesByCategory(category: string): Observable<Recipe[]> {
    /*
      Gets all recipes meta info from database filtered by
      category.
    */
    return this.http.get<Recipe[]>(this.apiURL + 'Recipes/' + category);
  }

  getEntry(ID: number): Observable<FullRecipe> {
    /*
      Retrieves a FULL recipe by it's name.
     */
    return this.http.get<FullRecipe>(this.apiURL + 'Recipes/' + ID, {reportProgress: true});
  }

  addRecipe(entry: FullRecipe): Observable<number> {
    /*
      Adds a new recipe to the database.
     */
    return this.http.post<number>(this.apiURL + 'Recipes', entry);
  }

  addDownloadURL(downloadURL: string, id: number)
  {
    /*
      Replaces Recipe image path with the download URL
      from Firebase.
     */

    const body = new FirebaseURL(id, downloadURL);
    return this.http.put(this.apiURL + 'Recipes', body, {reportProgress: true, observe: 'events'});
  }

  addPhoto(file: any, ID: string) {

    /*
      Adds photo to local file system.
      Migrated to Firebase, but leaving this here
      in case I want to use it for any reason.
     */

    const formModel= new FormData();
    formModel.append('File', file);
    formModel.append('ID', ID);

    return this.http.post(this.apiURL + 'Media', formModel);
  }

}
