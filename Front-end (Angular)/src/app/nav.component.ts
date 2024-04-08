import { Component } from '@angular/core';
import { WebService } from './web.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './authservice.component';

@Component({
  selector: 'navigation',
  templateUrl: './nav.component.html',
  styleUrls: []
})

// Class that controls the navbar for the site
export class NavComponent {
  id: any = '';
  isLoggedIn: any;
  buttonName: any;
  token: any = 'null';

  homeImagePath: String;
  profileImagePath: String;

  constructor(private authService: AuthService, private route: ActivatedRoute, public router: Router, private webService: WebService) {
    this.homeImagePath = "/assets/HomeLogo.png";
    this.profileImagePath = "/assets/ProfileLogo.png";

    if (this.isTokenExpired()) {
      // Logged out
      this.buttonName = "Login";
      this.isLoggedIn = false;
    } else {
      // Logged in
      this.buttonName = "Logout";
      this.isLoggedIn = true;
    }
  }

  // Search bar that takes the user to a page with the results of what they searched for
  searchPropertyBar(property_name: any) {
    this.resetPage();
    return window.location.href='http://localhost:4200/properties/search/' + property_name;
  }

  searchItemBar(item_name: any) {
    this.id = localStorage.getItem("propertyid");
    return window.location.href='http://localhost:4200/properties/' + this.id + '/items/search/' + item_name;
  }

  // Sets page back to 1 so user is on the first page
  resetPage() {
    sessionStorage['page'] = 1;
  }

  isTokenExpired() {
      // Code to check if user is logged in or not
      // If they are logged in then the logout button shows
      // If not the login button shows
      this.token = localStorage.getItem('token');
      if (this.token != 'null' && this.token != null) {
        const expiry = (JSON.parse(atob(this.token.split('.')[1]))).exp;
        return expiry * 1000 < Date.now();
      } else {
        return true
      }
  }

  loginLogoutButton() {
    if (this.isLoggedIn == false) {
      this.login();
    } else {
      this.logout();
    }
  }

  editLoginButton() {
    if (this.isLoggedIn == false) {
      this.login();
    } else {
      this.editLogin();
    }
  }

  login() {
    return window.location.href='http://localhost:4200/login';
  }

  logout() {
    this.authService.logout()
  }

  editLogin() {
    return window.location.href='http://localhost:4200/login/edit';
  }

  ifPropertySearch() {
    if ((this.router.url == "/" || this.router.url.includes("propert")) && !this.router.url.includes("item")){
      if (this.isTokenExpired() == false) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  ifItemSearch() {
    if (this.router.url.includes("item")){
      this.id = this.route.snapshot.params['id'];
      return true
    } else {
      return false
    }
  }
}
