import { Injectable } from '@angular/core';

import { ListEntry } from '../Models/ListEntry';
import { FullRecipe } from '../Models/FullRecipe';

@Injectable({
  providedIn: 'root'
})
export class PersistentdataService {

  public currentRecipe: FullRecipe;

  private storageName = 'CurrentRecipe';

  constructor() { }

  setCurrentRecipe(recipe: FullRecipe): void {
    localStorage.setItem('currentRecipe', JSON.stringify(recipe));
  }

  getCurrentRecipe(): FullRecipe {
    return JSON.parse(localStorage.getItem('currentRecipe'));
  }

}
