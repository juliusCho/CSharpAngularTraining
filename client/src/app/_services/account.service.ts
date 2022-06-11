import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User | undefined>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) {}

  login(model: { userName?: string; password?: string }) {
    return this.http.post<User>(`${this.baseUrl}account/login`, model).pipe(
      map((user) => {
        if (!user) return user;

        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSource.next(user);

        return user;
      })
    );
  }

  setCurrentUser(user?: User) {
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(undefined);
  }

  register(model: { userName?: string; password?: string }) {
    return this.http.post<User>(`${this.baseUrl}account/register`, model).pipe(
      map((user) => {
        if (!user) return user;

        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSource.next(user);

        return user;
      })
    );
  }
}
