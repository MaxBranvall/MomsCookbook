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

  private loading = false;
  private verified = false;
  private user = new Users();

  constructor(private authService: AuthenticationService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.user.ID = params.id;
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
