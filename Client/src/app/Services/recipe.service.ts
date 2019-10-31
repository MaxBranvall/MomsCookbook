import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { tap, map} from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Entry } from '../Models/Entry';
import { ENTRIES } from '../Models/Mock-Entries';
import { Recipe } from '../Models/Recipe';
import { ObserveOnSubscriber } from 'rxjs/internal/operators/observeOn';

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

  getAllEntries(): Observable<Entry[]> {
    return this.http.get<Entry[]>(this.apiUrl + 'recipe');
  }

  getEntry(Name : string): Observable<Entry[]> {
    return this.http.get<Entry[]>(this.apiUrl + 'recipe/' + Name);
  }

  addRecipe(s: Entry): Observable<Entry> {
    return this.http.post<Entry>(this.apiUrl + "Recipe", s);
  }

  addPhoto(file: any) {
    let input = new FormData();
    input.append("filesData", file);
    return this.http.post(this.apiUrl + "Media", input);
  }

  // addRecipe(recipe: string): Observable<string> {
  //   return this.http.post<string>(this.apiUrl + "recipe", recipe, this.httpOptions)
  // };

  // test(s: string): Observable<string

}
