import { Component } from '@angular/core';
import { WebService } from './web.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})

// Class for showing a single item
export class ItemComponent {
  id: any = '';
  item_id: any = '';
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
  private route: ActivatedRoute,  public authService: AuthService) {}

  // On startup it gets the id and item details
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
  }

  // Takes the user to the edit item page
  onEdit() {
    return window.location.href='http://localhost:4200/properties/' + this.id + '/items/' + this.item_id + '/edit';
  }

  // Deletes the current item
  onDelete() {
    let id = this.route.snapshot.params['id'];
    let item_id = this.route.snapshot.params['item_id'];
    this.webService.deleteItem(id, item_id)
    .subscribe( (response: any) => {
      return window.location.href='http://localhost:4200/properties/' + this.id + '/items/';
    } )
  }
}
