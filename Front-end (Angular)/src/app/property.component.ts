import { Component } from '@angular/core';
import { WebService } from './web.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})

// Class for showing a single property
export class PropertyComponent {
  property_list: any = [];
  items: any = [];
  profileJSON: string = '';
  username: any;
  id: any;

  itemForm: any;

  page: number = 1;

  hello: any;

  constructor(private webService: WebService,
  private route: ActivatedRoute,
  private formBuilder: FormBuilder) {}

  // When the app starts the forms for items and collections are set
  // The property and item details are retrieved
  ngOnInit() {

    this.itemForm = this.formBuilder.group( {
      item_name: ['', Validators.required],
      item_notes: ['', Validators.required],
    });

    this.property_list = this.webService.getProperty(
    this.route.snapshot.params['id']);

    this.items = this.webService.getItems(
      this.route.snapshot.params['id']);

    this.id = this.route.snapshot.params['id'];
    localStorage.setItem("propertyid", this.id);
  }

   // Takes the user to the edit item page
  onEdit(item_id: any) {
    return window.location.href='http://localhost:4200/properties/' + this.id + '/items/' + item_id + '/edit';
  }

  // Deletes the current item
  onDelete(item_id: any) {
    this.webService.deleteItem(this.id, item_id)
    .subscribe( (response: any) => {
      return window.location.href='http://localhost:4200/properties/' + this.id;
    } )
  }

  // Validation of the add item form
  isInvalid(control: any) {
    return this.itemForm.controls[control].invalid && this.itemForm.controls[control].touched;
  }
  isUnTouched() {
    return this.itemForm.controls.comment.pristine;
  }
  isIncomplete(){
    return this.isInvalid('item_name') || this.isInvalid('item_type') || this.isUnTouched();
  }
}
