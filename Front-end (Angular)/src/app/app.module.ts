import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { WebService } from './web.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HomeComponent } from './home.component';
import { RegisterComponent } from './register.component';
import { EditLoginComponent } from './editlogin.component';
import { LoginComponent } from './login.component';
import { PropertiesComponent } from './properties.component';
import { PropertyComponent } from './property.component';
import { AddPropertyComponent } from './addproperty.component';
import { EditPropertyComponent } from './editproperty.component';
import { ItemComponent } from './item.component';
import { AddItemComponent } from './additem.component';
import { EditItemComponent } from './edititem.component';
import { AuthModule } from '@auth0/auth0-angular';
import { NavComponent } from './nav.component';
import { SearchPropertyComponent } from './searchProperty.component';
import { SearchItemComponent } from './searchItem.component';

var routes: any = [
  {
   path: '',
   component: HomeComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login/edit',
    component: EditLoginComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
   path: 'properties',
   component: PropertiesComponent
  },
  {
    path: 'properties/:id/items',
    component: PropertyComponent
  },
  {
    path: 'newproperty',
    component: AddPropertyComponent
  },
  {
    path: 'properties/:id/edit',
    component: EditPropertyComponent
  },
  {
    path: 'properties/:id/items/:item_id',
    component: ItemComponent
  },
  {
    path: 'properties/:id/newitem',
    component: AddItemComponent
  },
  {
    path: 'properties/:id/items/:item_id/edit',
    component: EditItemComponent
  },
  {
    path: 'properties/search/:property_name',
    component: SearchPropertyComponent
  },
  {
    path: 'properties/:id/items/search/:item_name',
    component: SearchItemComponent
  }
 ];

@NgModule({
  declarations: [
    AppComponent, HomeComponent, RegisterComponent, EditLoginComponent, LoginComponent, PropertiesComponent, PropertyComponent, AddPropertyComponent, 
    EditPropertyComponent, ItemComponent, NavComponent, SearchPropertyComponent, AddItemComponent, EditItemComponent, SearchItemComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, RouterModule,
    RouterModule.forRoot(routes), ReactiveFormsModule, NgbModule,
    AuthModule.forRoot({
      domain:'dev-r6lrvnosktbzdiit.us.auth0.com',
      clientId: 'y6fhYpJFPCmjFDSl42dcBW2medKvlUU4',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    })
  ],
  providers: [WebService],
  bootstrap: [AppComponent]
})
export class AppModule { }
