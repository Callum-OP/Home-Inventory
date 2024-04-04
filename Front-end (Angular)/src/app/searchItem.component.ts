import { Component } from '@angular/core';
import { WebService } from './web.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'searchItem',
  templateUrl: './searchItem.component.html',
  styleUrls: ['./searchItem.component.css']
})

// Class for showing the search results from the search bar input
export class SearchItemComponent {

  search: any;
  property_list: any = [];
  items: any = [];
  page: number = 1;
  length: any;
  id: any;

  constructor(public webService: WebService, private route: ActivatedRoute) {}

  // On startup the page number is set and the properties search results are retrieved
  ngOnInit() {
    this.property_list = this.webService.getProperty(
      this.route.snapshot.params['id']);
    this.search = this.route.snapshot.params['item_name'];
    this.id = this.route.snapshot.params['id'];
    this.items = this.webService.searchItems(this.id, this.search);
  }

  // Takes the user to the edit Item page
  onEdit(item_id: any) {
    return window.location.href='http://localhost:4200/properties/' + this.id + '/items/' + item_id + '/edit';
  }

  // Deletes the Item currently being shown
  onDelete(item_id: any) {
    this.webService.deleteItem(this.id, item_id)
    .subscribe( (response: any) => {
      return window.location.href='http://localhost:4200/properties/' + this.id + '/items/search/' + this.search;
    } )
  }
}
