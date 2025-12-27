import { Injectable } from '@angular/core';
import { AuthApi } from './auth.api';
import {BehaviorSubject, Observable} from 'rxjs';
import { getMe } from './auth.types';
import {HttpHeaders} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export abstract class AuthService {
  private currentUser$ = new BehaviorSubject<getMe>({});
  private currentMessageCount$ = new BehaviorSubject<number|0>(0);

  protected constructor(private authApi: AuthApi) {
  }

  private loadUser(): void {
    this.authApi.getMeInfo().subscribe({
      next: (user) => this.currentUser$.next(user),
      error: () => this.currentUser$.next({}),
    });
  }

  private loadMessage(): void {
    this.authApi.getMessagesCount().subscribe({
      next: (count) => this.currentMessageCount$.next(count),
      error: () => this.currentMessageCount$.next(0),
    });
  }

  public getMeInfo(): Observable<getMe> {
    this.loadUser();

    return this.currentUser$.asObservable();
  }

  public getMessagesCount(): Observable<number|0> {
    this.loadMessage();

    return this.currentMessageCount$.asObservable();
  }

  public setHeaderAuthorization(): HttpHeaders {
    return this.authApi.setHeaderAuthorization();
  }
}
