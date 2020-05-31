import { Injectable, ErrorHandler } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor() { }

  handleError(error: any) {
    console.error('Error: ', error.message);
    console.error(error);
    alert(error);
  }
}
