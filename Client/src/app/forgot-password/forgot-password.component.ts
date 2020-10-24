import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Users } from '../Entities/Users';
import { AuthenticationService } from '../Services/authentication.service';
import { LocalStorageItem } from '../_helpers/local-storage-item.enum';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  // TODO: Refactor whole class
  // TODO: add loading indicator

  public user = new Users();
  public confirmPasswordRef: string;

  public loading = false;

  public error = false;
  public errorText: string;
  public errorType: string;
  public statusCode: number;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private authService: AuthenticationService) { }

  ngOnInit(): void {

    this.loading = true;

    this.activatedRoute.params.subscribe( params => {
      // tslint:disable-next-line: radix
      this.user.ID = parseInt(params.id);
    }
    );

    this.activatedRoute.queryParams.subscribe(params => {
      this.user.Token = params.token;
    });

    localStorage.setItem(LocalStorageItem.ResetPassword, JSON.stringify(this.user));

    this.authService.verifyForgotPasswordToken().subscribe( res =>
      {

        console.log(res.status);

        this.loading = false;

        if (res.status === 204) {
          console.log('good');
        }
        else {
          console.log('Invalid token');
        }
      }, error => {
        alert('Invalid Token. Please return to forgot password menu to request a new one.');
        this.router.navigate(['/login']);
      }
      );
  }

  submit() {

    this.loading = true;

    this.authService.resetPassword(this.user).subscribe( res =>
      {

        this.loading = false;

        localStorage.removeItem(LocalStorageItem.ResetPassword);
        if (res.status === 201) {
          alert('Password successfully reset.');
          this.router.navigate(['/login']);
        } else {
          alert('Password not reset.');
        }
      },
      error => {
        this.loading = false;
        this.error = true;
        this.errorText = error.error;
        this.errorType = error.statusText;
        this.statusCode = error.status;
      }
      );
  }

  ngOnDestroy() {
    localStorage.removeItem(LocalStorageItem.ResetPassword);
  }

}
