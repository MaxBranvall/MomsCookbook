import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Entry } from '../Models/Entry';
import { Recipe } from '../Models/Recipe';

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

  getEntry(Name: string): Observable<Entry> {
    /*
      Retrieves a FULL recipe by it's name.
      TODO: Get recipe by UID instead for scalability.
     */
    return this.http.get<Entry>(this.apiURL + 'Recipes/' + Name, {reportProgress: true});
  }

  addRecipe(entry: Entry): Observable<number> {
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
    return this.http.put(this.apiURL + 'Recipes', {id, downloadURL}, {reportProgress: true, observe: 'events'});
  }

  addPhoto(file: any, ID: string) {

    /*
      Adds photo to local file system.
      Migrated to Firebase, but leaving this here
      in case I want to use it for any reason.
     */

    let formModel= new FormData();
    formModel.append('File', file);
    formModel.append('ID', ID);

    return this.http.post(this.apiURL + 'Media', formModel);
  }

}
