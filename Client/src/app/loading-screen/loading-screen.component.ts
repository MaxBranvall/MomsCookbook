import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit {

  @Input() progress$: Observable<number>;
  @Input() Image: boolean;

  constructor() { }

  ngOnInit() {
  }

}
