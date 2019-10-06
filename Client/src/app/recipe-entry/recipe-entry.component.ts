import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-recipe-entry',
  templateUrl: './recipe-entry.component.html',
  styleUrls: ['./recipe-entry.component.scss']
})
export class RecipeEntryComponent implements OnInit {

  t = new Test('Max');

  constructor() {}

  ngOnInit() {
  }

  testFunc() {
    console.log("Button Pressed");
  }

  get diagnostic() { return JSON.stringify(this.t); }

}

class Test {
  constructor(
    public name: string
  ) { }
}
