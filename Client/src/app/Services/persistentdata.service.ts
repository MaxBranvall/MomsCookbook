import { Injectable } from '@angular/core';

import { ListEntry } from '../Models/ListEntry';

@Injectable({
  providedIn: 'root'
})
export class PersistentdataService {

  public currentRecipe: ListEntry;

  private storageName = 'CurrentRecipe';

  constructor() { }

  setCurrentRecipe()

}
