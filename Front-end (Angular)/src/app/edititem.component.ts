import { Component } from '@angular/core';
import { WebService } from './web.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'edititem',
  templateUrl: './edititem.component.html',
  styleUrls: ['./edititem.component.css']
})

// Class to edit the details of a specific item
export class EditItemComponent {
  itemForm: any;
  id: any;
  item_id: any;
  item_name: any = '';
  item_manufacturer: any = '';
  item_model: any = '';
  item_type: any = '';
  item_image: any = '';
  serial_no: any = '';
  purchase_date: any = '';
  purchase_cost: any = '';
  estimated_value: any = '';
  item_notes: any = '';

  constructor(private webService: WebService,
  private route: ActivatedRoute,
  private formBuilder: FormBuilder) {}

  // On startup it gets the id and item details and sets up the edit item form
  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.item_id = this.route.snapshot.params['item_id'];

    this.webService.getItem(this.id, this.item_id)
      .subscribe( (response: any) => {
        this.item_name = response.item_name;
        this.item_manufacturer = response.item_manufacturer;
        this.item_model = response.item_model;
        this.item_type = response.item_type;
        this.item_image = response.item_img;
        this.serial_no = response.serial_no;
        this.purchase_date = response.purchase_date;
        this.purchase_cost = response.purchase_cost;
        this.estimated_value = response.estimated_value;
        this.item_notes = response.item_notes;
    } )

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

  }

  // Changes the details of the chosen item using form data
  onSubmit() {
    this.webService.editItem(this.itemForm.value, this.id, this.item_id)
    .subscribe( (response: any) => {
      return window.location.href='http://localhost:4200/properties/' + this.id + '/items/' + this.item_id;
    })
  }

  // Validation for the edit item form
  isInvalid(control: any) {
    return this.itemForm.controls[control].invalid;
  }
  isIncomplete(){
    return this.isInvalid('item_name') || this.isInvalid('item_type');
  }
}
