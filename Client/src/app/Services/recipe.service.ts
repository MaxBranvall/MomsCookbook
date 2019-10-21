import { Injectable } from '@angular/core';

import { Entry } from '../Models/Entry';
import { ENTRIES } from '../Models/Mock-Entries';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor() { }

  getEntries(): Entry[] {
    return ENTRIES;
  }

}
