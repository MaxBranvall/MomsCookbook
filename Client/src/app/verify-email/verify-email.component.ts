import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../Services/authentication.service';
import { Users } from '../Entities/Users';
import { LocalStorageItem } from '../_helpers/local-storage-item.enum';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

 public loading = false;
 public verified = false;
 public user = new Users();

  constructor(private authService: AuthenticationService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.user.ID = params.id;
    });

    this.route.queryParams.subscribe(params => {
      this.user.Token = params.token;
    });

    this.sendRequest();

  }

  sendRequest() {

    localStorage.setItem(LocalStorageItem.CurrentUser, JSON.stringify(this.user));
    this.loading = true;

    this.authService.verifyEmail(this.user.ID).subscribe( x => {
      this.loading = false;
      this.verified = true;
      localStorage.setItem(LocalStorageItem.CurrentUser, JSON.stringify(x));
      }, error => {
        this.loading = false;
        console.error(error);
      }
    );
  }
}
