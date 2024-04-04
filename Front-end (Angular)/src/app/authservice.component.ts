import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    token: string = 'null';

    userid: any = 'null';

  constructor(private router: Router) { }

  public setToken(token: string): void {
    this.token = token
    localStorage.setItem("token", token);
  }

  public setUser(userid: any): void {
    this.userid = userid
    localStorage.setItem("userid", userid);
  }

  public getToken(): string {
    this.token = localStorage.getItem('token') || this.token;
    return this.token
  }

  public getUser(): string {
    this.userid = localStorage.getItem('userid') || this.userid;
    return this.userid
  }

  public logout(): string {
    this.token = 'null'
    this.userid = 'null'
    localStorage.setItem("token", 'null');
    localStorage.setItem("userid", 'null');
    return window.location.href='http://localhost:4200';
  }
}