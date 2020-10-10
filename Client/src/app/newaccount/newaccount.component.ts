import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-newaccount',
  templateUrl: './newaccount.component.html',
  styleUrls: ['./newaccount.component.scss']
})
export class NewaccountComponent implements OnInit {

  constructor(private router: ActivatedRoute) { }

  ngOnInit(): void {

    this.router.queryParams.subscribe(params => {
      console.log(params.id);
    });

  }

}
