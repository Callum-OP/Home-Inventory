import { Component } from '@angular/core';
import { WebService } from './web.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'Properties',
  templateUrl: './Properties.component.html',
  styleUrls: ['./Properties.component.css']
})

// Class for showing all Properties
export class PropertiesComponent {

  property_list: any = [];
  page: number = 1;
  length: any;
  thumbnail: any;

  constructor(public webService: WebService, private route: ActivatedRoute, public authService: AuthService) {}

  // When the app starts the page number is set and all properties are gathered
  ngOnInit() {
    this.property_list = this.webService.getProperties();
  }

  // Takes the user to the edit property page
  onEdit(id: any) {
    return window.location.href='http://localhost:4200/properties/' + id + '/edit';
  }

  // Deletes the property currently being shown
  onDelete(id: any) {
    this.webService.deleteProperty(id)
    .subscribe( (response: any) => {
      return window.location.href='http://localhost:4200/properties';
    } )
  }

  exportProperty() {
    this.webService.exportProperties()
    .subscribe( (response: any) => {
      console.log(response);
    } )
  }

}
