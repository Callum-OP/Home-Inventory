import { Component } from '@angular/core';
import { WebService } from './web.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'editproperty',
  templateUrl: './editproperty.component.html',
  styleUrls: ['./editproperty.component.css']
})

// Class to edit the details of a specific property
export class EditPropertyComponent {
  property_list: any = [];
  propertyForm: any;

  constructor(private webService: WebService,
  private route: ActivatedRoute,
  private formBuilder: FormBuilder) {}

  // On startup it gets the property details and sets up the edit property form
  ngOnInit() {
  this.property_list = this.webService.getProperty(
    this.route.snapshot.params['id']);

  this.propertyForm = this.formBuilder.group( {
    property_name: ['', Validators.required],
    property_notes: [''],
    thumbnail: ['']
  });

  }

  // Changes the details of the chosen property using form data
  onSubmit() {
    let id = this.route.snapshot.params['id'];
    this.webService.editProperty(this.propertyForm.value, id)
    .subscribe( (response: any) => {
      return window.location.href='http://localhost:4200/properties';
    })
  }

  // Validation of the edit property form
  isInvalid(control: any) {
    return this.propertyForm.controls[control].invalid;
  }
  isIncomplete(){
    return this.isInvalid('property_name');
  }
}
