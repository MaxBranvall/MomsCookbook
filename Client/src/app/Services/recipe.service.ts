import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';

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

  getAllEntries(): Observable<HttpResponse<Recipe[]>> {
    /*
      Gets all recipes meta info from database.
     */
    return this.http.get<Recipe[]>(this.apiURL + 'Recipes', { observe : 'response'});
  }

  getAllEntriesByCategory(category: string): Observable<HttpResponse<FullRecipe[]>> {
    /*
      Gets all recipes meta info from database filtered by
      category.
    */
    return this.http.get<FullRecipe[]>(this.apiURL + 'Recipes/categories/' + category, { observe : 'response'});
  }

  getEntry(ID: number): Observable<HttpResponse<FullRecipe>> {
    /*
      Retrieves a FULL recipe by it's name.
     */
    return this.http.get<FullRecipe>(this.apiURL + 'Recipes/' + ID, { observe : 'response'});
  }

  addRecipe(entry: FullRecipe): Observable<FullRecipe> {
    /*
      Adds a new recipe to the database.
     */
    return this.http.post<FullRecipe>(this.apiURL + 'Recipes', entry);
  }

  addDownloadURL(downloadURL: string, id: number): Observable<HttpResponse<FullRecipe>> {
    /*
      Replaces Recipe image path with the download URL
      from Firebase.
     */

    const body = new FirebaseURL(id, downloadURL);
    return this.http.put<FullRecipe>(this.apiURL + 'Recipes/', body, { observe: 'response' });
  }

  updateRecipe(recipe: FullRecipe): Observable<FullRecipe> {
    return this.http.put<FullRecipe>(this.apiURL + 'Recipes', recipe);
  }

  addPhoto(file: any, ID: string) {

    /*
      Adds photo to local file system.
      Migrated to Firebase, but leaving this here
      in case I want to use it for any reason.
     */

    const formModel = new FormData();
    formModel.append('File', file);
    formModel.append('ID', ID);

    return this.http.post(this.apiURL + 'Media', formModel);
  }

}
