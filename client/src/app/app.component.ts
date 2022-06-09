import { Component, OnInit } from '@angular/core';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'The Dating app';
  users: Array<{
    id: string;
    userName: string;
    passwordHash?: string;
    passwordSalt?: string;
  }> = [];

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userStr = localStorage.getItem('user');
    const user: User | undefined = userStr ? JSON.parse(userStr) : undefined;
    this.accountService.setCurrentUser(user);
  }
}
