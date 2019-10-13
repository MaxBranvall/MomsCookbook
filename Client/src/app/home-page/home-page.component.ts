import { Component, OnInit } from '@angular/core';

import { categories } from '../Models/categories';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  categories = categories;

  constructor() { }

  ngOnInit() {
  }

}
