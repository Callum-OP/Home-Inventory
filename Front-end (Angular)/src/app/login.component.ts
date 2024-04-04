import { Component } from '@angular/core';
import { WebService } from './web.service';
import { AuthService } from './authservice.component';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

// Class to login a user
export class LoginComponent {
  loginForm: any;

  constructor(private authService: AuthService, 
  private webService: WebService,
  private route: ActivatedRoute,
  private formBuilder: FormBuilder,) {}

  // On startup the add user form is set
  ngOnInit() {
  this.loginForm = this.formBuilder.group( {
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  }

  // Checks if the user exists and then logs them in if they do
  onSubmit() {
    this.webService.login(this.loginForm.value)
    .subscribe( (response: any) => {
      this.authService.setToken(response.token)
      this.authService.setUser(response.userid)
      return window.location.href='http://localhost:4200';
    })
  }

  // Validation for the user form
  isInvalid(control: any) {
    return this.loginForm.controls[control].invalid && this.loginForm.controls[control].touched;
  }
  isUnTouched() {
    return this.loginForm.controls.username.pristine || this.loginForm.controls.password.pristine;
  }
  isIncomplete(){
    return this.isInvalid('username') || this.isInvalid('pasword') || this.isUnTouched();
  }
}
