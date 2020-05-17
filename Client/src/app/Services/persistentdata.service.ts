import { Injectable } from '@angular/core';

import { FullRecipe } from '../Models/FullRecipe';
import { LocalStorageItem } from '../_helpers/local-storage-item.enum';

@Injectable({
  providedIn: 'root'
})
export class PersistentdataService {

  public currentRecipe: FullRecipe;

  constructor() { }

  setCurrentRecipe(recipe: FullRecipe): void {
    localStorage.setItem(LocalStorageItem.CurrentRecipe, JSON.stringify(recipe));
  }

  getCurrentRecipe(): FullRecipe {
    return JSON.parse(localStorage.getItem(LocalStorageItem.CurrentRecipe));
  }

}
