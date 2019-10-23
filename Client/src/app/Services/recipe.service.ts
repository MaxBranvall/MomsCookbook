import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { tap, map} from 'rxjs/operators';
import { HttpClient} from '@angular/common/http';

import { Entry } from '../Models/Entry';
import { ENTRIES } from '../Models/Mock-Entries';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private apiUrl = "https://localhost:5001/api/"

  constructor(
    private http: HttpClient,
  ) { }

  getAllEntries(): Observable<Entry[]> {
    return this.http.get<Entry[]>(this.apiUrl + 'recipe');
  }

  getEntry(Name : string): Observable<Entry[]> {
    return this.http.get<Entry[]>(this.apiUrl + 'recipe/' + Name);
  }

}
