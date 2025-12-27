import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {getMe} from './auth.types';
import env from '../env/env.service';
import getCookie from '../cookie/cookie.service';

@Injectable({
  providedIn: 'root'
})
export class AuthApi {
  private accessToken: string = '';

  constructor(private http: HttpClient) {
  }

  public getMeInfo(): Observable<getMe> {
    const headers = this.setHeaderAuthorization();

    return this.http.get<getMe>(
      '/api/getMe',
      { headers }
    );
  }

  public getMessagesCount(): Observable<number|0> {
    const headers = this.setHeaderAuthorization();

    return this.http.get<number|0>(
      '/api/Messages/Count',
      { headers }
    );
  }

  public setHeaderAuthorization(): HttpHeaders {
    const accessTokenCookie = getCookie('_token');
    this.accessToken = accessTokenCookie || env.accessTokenTest;

    return new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-type': 'application/json',
      'Accept': 'application/json'
    });
  }
}
