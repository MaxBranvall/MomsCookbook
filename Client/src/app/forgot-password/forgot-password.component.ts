import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Users } from '../Entities/Users';
import { AuthenticationService } from '../Services/authentication.service';
import { LocalStorageItem } from '../_helpers/local-storage-item.enum';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  // TODO: Refactor whole class
  // TODO: add loading indicator

  public user = new Users()
  public confirmPasswordRef: string;

  constructor(private route: ActivatedRoute, private authService: AuthenticationService) { }

  ngOnInit(): void {

    this.route.params.subscribe( params => {
      // tslint:disable-next-line: radix
      this.user.ID = parseInt(params.id);
    }
    );

    this.route.queryParams.subscribe(params => {
      this.user.Token = params.token;
    });

    localStorage.setItem(LocalStorageItem.CurrentUser, JSON.stringify(this.user));

    this.authService.verifyForgotPasswordToken().subscribe( res =>
      {
        if (res.status === 204) {
          console.log('good');
        }
        else {
          alert('Invalid Token');
        }
      }
      );
  }

  submit() {
    this.user.Token = null;
    this.user.EmailAddress = 'test@test.com';
    this.authService.resetPassword(this.user).subscribe( res =>
      {
        if (res.status === 201) {
          localStorage.setItem(LocalStorageItem.CurrentUser, JSON.stringify(res.body));
          alert('Password successfully reset.');
        } else {
          alert('Password not reset.');
        }
      })
  }

}
