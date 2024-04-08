import { Component } from '@angular/core';
import { WebService } from './web.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'editlogin',
  templateUrl: './editlogin.component.html',
  styleUrls: ['./editlogin.component.css']
})

// Class to add a user to the users collection
export class EditLoginComponent {
  editLoginForm: any;

  constructor(private webService: WebService,
  private route: ActivatedRoute,
  private formBuilder: FormBuilder) {}

  // On startup the add user form is set
  ngOnInit() {
  this.editLoginForm = this.formBuilder.group( {
    old_username: ['', Validators.required],
    old_password: ['', Validators.required],
    new_username: ['', Validators.required],
    new_password: ['', Validators.required]
  });

  }

  // Adds the user to the database
  onSubmit() {
    this.webService.updateUser(this.editLoginForm.value)
    .subscribe( (response: any) => {
      console.log(response);
      this.editLoginForm.reset();
    })
  }

  // Validation for the add user form
  isInvalid(control: any) {
    return this.editLoginForm.controls[control].invalid && this.editLoginForm.controls[control].touched;
  }
  isUnTouched() {
    return this.editLoginForm.controls.old_username.pristine || this.editLoginForm.controls.old_password.pristine || this.editLoginForm.controls.new_username.pristine || this.editLoginForm.controls.new_password.pristine;
  }
  isIncomplete(){
    return this.isInvalid('old_username') || this.isInvalid('old_pasword') || this.isInvalid('new_username') || this.isInvalid('new_pasword') ||this.isUnTouched();
  }
}
