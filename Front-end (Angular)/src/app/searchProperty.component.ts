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
    if (sessionStorage['page']) {
      this.page = Number(sessionStorage['page'])
    }
    this.search = this.route.snapshot.params['property_name'];
    this.property_list = this.webService.searchProperties(this.search, this.page);
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

  // Goes back a number of pages when the previous page button is pressed
  previousPage(number: any) {
    if (this.page > number) {
      this.page = this.page - number;
      sessionStorage['page'] = this.page
      this.property_list = this.webService.getProperties(this.page);
    }
  }

  // Goes foward a number of pages when the foward page button is pressed
  nextPage(number: any) {
    this.page = this.page + number;
    sessionStorage['page'] = this.page
    this.property_list = this.webService.getProperties(this.page);

    // Check if this is the last page
    this.property_list.subscribe((result: { length: string; })=>this.isLastPage(result.length, number));
  }

  
  // Check if the current page is empty, 
  // if it is then send the user back as they can't go any further
  isLastPage(result: string, number: number) {
    this.length = result;
    if(this.length == '') {
      this.page = this.page - number;
      sessionStorage['page'] = this.page;
      this.property_list = this.webService.getProperties(this.page);
    }
  }
}
