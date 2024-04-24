import { Component } from '@angular/core';
import { WebService } from './web.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

// Class to add a user to the users collection
export class RegisterComponent {
  registerForm: any;

  constructor(private webService: WebService,
  private route: ActivatedRoute,
  private formBuilder: FormBuilder) {}

  // On startup the add user form is set
  ngOnInit() {
  this.registerForm = this.formBuilder.group( {
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  }

  // Adds the user to the database
  onSubmit() {
    this.webService.register(this.registerForm.value)
    .subscribe( (response: any) => {
      console.log(response);
      return window.location.href='http://localhost:4200/login';
    })
  }

  // Validation for the add user form
  isInvalid(control: any) {
    return this.registerForm.controls[control].invalid && this.registerForm.controls[control].touched;
  }
  isUnTouched() {
    return this.registerForm.controls.username.pristine || this.registerForm.controls.password.pristine;
  }
  isIncomplete(){
    return this.isInvalid('username') || this.isInvalid('password') || this.isUnTouched();
  }
}
