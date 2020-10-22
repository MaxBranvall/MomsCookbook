import { Injectable, ErrorHandler } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor() { }

  handleError(error: any) {
    console.error('Error: ', error.message);
    console.error(error);

    if (error.status === 403) {
      alert('Invalid Token. Please return to forgot password menu to request a new one.');
    } else {
      alert('We caught an error.\nPlease contact Brandaddy to get it fixed.\nError:\n' + error);
    }
  }
}
