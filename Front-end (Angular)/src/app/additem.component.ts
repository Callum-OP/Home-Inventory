import { Component } from '@angular/core';
import { WebService } from './web.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.css']
})

// Class to add a item to the items collection
export class AddItemComponent {
  property_list: any = [];
  itemForm: any;
  id: any = this.route.snapshot.params['id']

  constructor(private webService: WebService,
  private route: ActivatedRoute,
  private formBuilder: FormBuilder) {}

  // On startup the add item form is set
  ngOnInit() {
  this.itemForm = this.formBuilder.group( {
    item_name: ['', Validators.required],
    item_manufacturer: [''],
    item_model: [''],
    item_type: [''],
    item_image: [''],
    serial_no: [''],
    purchase_date: [''],
    purchase_cost: [''],
    estimated_value: [''],
    item_notes: [''],
  });

  this.property_list = this.webService.getProperty(
  this.id);

  }

  // Adds the item to the database
  onSubmit() {
    this.webService.postItem(this.itemForm.value, this.id)
    .subscribe( (response: any) => {
      return window.location.href='http://localhost:4200/properties/' + this.id + '/items/';
    })
  }

  // Validation for the add item form
  isInvalid(control: any) {
    return this.itemForm.controls[control].invalid && this.itemForm.controls[control].touched;
  }
  isUnTouched() {
    return this.itemForm.controls.item_name.pristine;
  }
  isIncomplete(){
    return this.isInvalid('item_name') || this.isUnTouched();
  }
}
