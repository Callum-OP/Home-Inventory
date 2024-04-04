import { Component } from '@angular/core';

@Component({
 selector: 'home',
 templateUrl: './home.component.html',
 styleUrls: ['./home.component.css']
})

// Class the controls the home page
export class HomeComponent {
   token: any = 'null';
   
   isTokenExpired() {
      // Code to check if user is logged in or not
      // If they are logged in then the logout button shows
      // If not the login button shows
      this.token = localStorage.getItem('token');
      if (this.token != 'null') {
        const expiry = (JSON.parse(atob(this.token.split('.')[1]))).exp;
        return expiry * 1000 < Date.now();
      } else {
        return true
      }
  }
}


