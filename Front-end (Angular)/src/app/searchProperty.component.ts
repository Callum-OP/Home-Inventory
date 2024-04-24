import { Component } from '@angular/core';
import { WebService } from './web.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'searchProperty',
  templateUrl: './searchProperty.component.html',
  styleUrls: ['./searchProperty.component.css']
})

// Class for showing the search results from the search bar input
export class SearchPropertyComponent {

  search: any;
  property_list: any = [];
  page: number = 1;
  length: any;

  constructor(public webService: WebService, private route: ActivatedRoute) {}

  // On startup the page number is set and the properties search results are retrieved
  ngOnInit() {
    this.search = this.route.snapshot.params['property_name'];
    this.property_list = this.webService.searchProperties(this.search);
  }

  // Takes the user to the edit property page
  onEdit(id: any) {
    return window.location.href='http://localhost:4200/properties/' + id + '/edit';
  }

  // Deletes the property currently being shown
  onDelete(id: any) {
    this.webService.deleteProperty(id)
    .subscribe( (response: any) => {
      return window.location.href='http://localhost:4200/properties/search/' + this.search;
    } )
  }
}
