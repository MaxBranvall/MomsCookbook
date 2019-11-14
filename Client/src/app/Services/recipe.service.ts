import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Entry } from '../Models/Entry';
import { Recipe } from '../Models/Recipe';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private apiUrl = "https://localhost:5001/api/";
  // private apiUrl = "http://192.168.1.45:5000/api/";

  constructor(
    private http: HttpClient,
  ) { }

  getAllEntries(): Observable<Recipe[]> {
    /*
      Gets all recipes meta info from database.
     */
    return this.http.get<Recipe[]>(this.apiUrl + 'Recipes');
  }

  getEntry(Name : string): Observable<Entry> {
    /*
      Retrieves a FULL recipe by it's name.
      TODO: Get recipe by UID instead for scalability.
     */
    return this.http.get<Entry>(this.apiUrl + 'Recipes/' + Name, {reportProgress: true});
  }

  addRecipe(entry: Entry): Observable<number> {
    /*
      Adds a new recipe to the database.
     */
    return this.http.post<number>(this.apiUrl + "Recipes", entry);
  }

  addDownloadURL(downloadURL: string, id: number)
  {
    /*
      Replaces Recipe image path with the download URL
      from Firebase.
     */
    return this.http.put(this.apiUrl + "Recipes", {id, downloadURL}, {reportProgress: true, observe: "events"});
  }

  addPhoto(file: any, ID: string) {

    /*
      Adds photo to local file system.
      Migrated to Firebase, but leaving this here
      in case I want to use it for any reason.
     */

    let formModel= new FormData();
    formModel.append("File", file);
    formModel.append("ID", ID);

    return this.http.post(this.apiUrl + "Media", formModel);
  }

}
