import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { tap, map} from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Entry } from '../Models/Entry';
import { Recipe } from '../Models/Recipe';
import { ENTRIES } from '../Models/Mock-Entries';
import { ObserveOnSubscriber } from 'rxjs/internal/operators/observeOn';
import { Identifiers } from '@angular/compiler/src/render3/r3_identifiers';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private apiUrl = "https://localhost:5001/api/"
  httpOptions = {
    // headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    headers: new HttpHeaders({'Content-Type': 'image/jpeg'})
  };

  constructor(
    private http: HttpClient,
  ) { }

  getAllEntries(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiUrl + 'recipe');
  }

  getEntry(Name : string): Observable<Entry[]> {
    return this.http.get<Entry[]>(this.apiUrl + 'recipe/' + Name);
  }

  addRecipe(s: Entry): Observable<number> {
    return this.http.post<number>(this.apiUrl + "Recipe", s);
  }

  addPhoto(file: any, ID: string) {
    let formModel= new FormData();
    formModel.append("File", file);
    formModel.append("ID", ID);

    return this.http.post(this.apiUrl + "Media", formModel);
  }

  // addRecipe(recipe: string): Observable<string> {
  //   return this.http.post<string>(this.apiUrl + "recipe", recipe, this.httpOptions)
  // };

  // test(s: string): Observable<string

}
