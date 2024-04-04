import { Component } from '@angular/core';
import { WebService } from './web.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'addproperty',
  templateUrl: './addproperty.component.html',
  styleUrls: ['./addproperty.component.css']
})

// Class to add a property to the propertys collection
export class AddPropertyComponent {
  property_list: any = [];
  propertyForm: any;

  constructor(private webService: WebService,
  private route: ActivatedRoute,
  private formBuilder: FormBuilder) {}

  // On startup the add property form is set
  ngOnInit() {
  this.propertyForm = this.formBuilder.group( {
    property_name: ['', Validators.required],
    property_notes: [''],
    thumbnail: [''],
    user_id: [''],
  });

  this.property_list = this.webService.getProperty(
  this.route.snapshot.params['id']);

  }

  // Adds the property to the database
  onSubmit() {
    this.webService.postProperty(this.propertyForm.value)
    .subscribe( (response: any) => {
      return window.location.href='http://localhost:4200/properties';
    })
  }

  // Validation for the add property form
  isInvalid(control: any) {
    return this.propertyForm.controls[control].invalid && this.propertyForm.controls[control].touched;
  }
  isUnTouched() {
    return this.propertyForm.controls.property_name.pristine;
  }
  isIncomplete(){
    return this.isInvalid('property_name') || this.isUnTouched();
  }
}
