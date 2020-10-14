import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private authService: AuthenticationService) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe( params => {
      // tslint:disable-next-line: radix
      this.user.ID = parseInt(params.id);
    }
    );

    this.activatedRoute.queryParams.subscribe(params => {
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
    this.authService.resetPassword(this.user).subscribe( res =>
      {
        localStorage.setItem(LocalStorageItem.CurrentUser, null);
        if (res.status === 201) {
          alert('Password successfully reset.');
          this.router.navigate(['/login']);
        } else {
          alert('Password not reset.');
        }
      })
  }

}
