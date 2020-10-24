import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Controller } from 'src/app/_helpers/controller.enum';

@Injectable({
  providedIn: 'root'
})
export class PollService {

  private api = environment.apiURL;

  constructor(private http: HttpClient) { }

  pollAPI(): Observable<HttpResponse<number>> {

    return this.http.get<number>(this.api + Controller.Poll, { observe: 'response' });

  }

}
