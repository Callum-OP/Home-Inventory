import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { AuthService } from './authservice.component';
import { ActivatedRoute } from '@angular/router';

@Injectable()
// Class for calling the api for the app
export class WebService {

  private propertyid: any;
  private token: any
  private userid: any

  constructor(private authService: AuthService, 
    private http: HttpClient, private route: ActivatedRoute,) {

  }

  property_list: any;

  getPropertyID() {
    this.propertyid = this.route.snapshot.params['id'];
    return this.propertyid;
  }

  login(user: any) {
    let postData = new FormData();
    postData.append("username", user.username);
    postData.append("password", user.password);

    return this.http.post('http://localhost:5000/api/v1.0/homeinventory/login', postData);
  }

  register(user: any) {
    let postData = new FormData();
    postData.append("username", user.username);
    postData.append("password", user.password);

    return this.http.post('http://localhost:5000/api/v1.0/homeinventory/register', postData);
  }

  updateUser(user: any) {
    this.token = this.authService.getToken()
    this.userid = this.authService.getUser()
    let postData = new FormData();
    postData.append("old_username", user.old_username);
    postData.append("old_password", user.old_password);
    postData.append("new_username", user.new_username);
    postData.append("new_password", user.new_password);

    return this.http.put('http://localhost:5000/api/v1.0/homeinventory/updateuser' + '?token=' + this.token + '&userid=' + this.userid, postData);
  }

  getProperties(page: number) {
    this.token = this.authService.getToken()
    this.userid = this.authService.getUser()
    return this.http.get(
      'http://localhost:5000/api/v1.0/homeinventory' + '?token=' + this.token + '&userid=' + this.userid + '&pn=' + page
    );
  }

  getProperty(id: any) {
    this.token = this.authService.getToken()
    this.userid = this.authService.getUser()
    this.propertyid = id;
    return this.http.get('http://localhost:5000/api/v1.0/homeinventory/' + id + '?token=' + this.token + '&userid=' + this.userid);
  }

  searchProperties(property_name: any, page: number) {
    this.token = this.authService.getToken()
    this.userid = this.authService.getUser()
    return this.http.get(
      'http://localhost:5000//api/v1.0/homeinventory/search/' + property_name  + '?token=' + this.token + '&userid=' + this.userid + '&pn=' + page);
  }

  postProperty(property: any) {
    this.token = this.authService.getToken()
    let postData = new FormData();
    postData.append("property_name", property.property_name);
    postData.append("property_notes", property.property_notes);
    postData.append("thumbnail", property.thumbnail);
    postData.append("user_id", property.user_id);

    return this.http.post('http://localhost:5000/api/v1.0/homeinventory' + '?token=' + this.token, postData);
  }

  editProperty(property: any, id: any) {
    this.token = this.authService.getToken()
    let postData = new FormData();
    postData.append("property_name", property.property_name);
    postData.append("property_notes", property.property_notes);
    postData.append("thumbnail", property.thumbnail);
    postData.append("user_id", property.user_id);

    return this.http.put('http://localhost:5000/api/v1.0/homeinventory/' + id + '?token=' + this.token, postData);
  }

  deleteProperty(id: any) {
    this.token = this.authService.getToken()
    return this.http.delete('http://localhost:5000/api/v1.0/homeinventory/' + id + '?token=' + this.token);
  }

  getItems(id: any) {
    this.token = this.authService.getToken()
    return this.http.get(
    'http://localhost:5000/api/v1.0/homeinventory/' +
    id + '/items' + '?token=' + this.token);
  }

  getItem(id: any, item_id: any) {
    this.token = this.authService.getToken()
    console.log('http://localhost:5000/api/v1.0/homeinventory/' +
    id + '/items/' + item_id);
    return this.http.get('http://localhost:5000/api/v1.0/homeinventory/' +
    id + '/items/' + item_id + '?token=' + this.token);
  }

  searchItems(id:any, item_name: any) {
    this.token = this.authService.getToken()
    return this.http.get(
      'http://localhost:5000//api/v1.0/homeinventory/' +
      id + '/search/' + item_name + '?token=' + this.token 
    );
  }

  postItem(item: any, propertyid: any) {
    this.token = this.authService.getToken()
    let postData = new FormData();
    postData.append("item_name", item.item_name);
    postData.append("item_manufacturer", item.item_manufacturer);
    postData.append("item_model", item.item_model);
    postData.append("item_type", item.item_type);
    postData.append("item_img", item.item_image);
    postData.append("serial_no", item.serial_no);
    postData.append("purchase_date", item.purchase_date);
    postData.append("purchase_cost", item.purchase_cost);
    postData.append("estimated_value", item.estimated_value);
    postData.append("item_notes", item.item_notes);

    return this.http.post('http://127.0.0.1:5000/api/v1.0/homeinventory/' +
                            propertyid + '/items' + '?token=' + this.token, postData);
  }

  duplicateItem(id: any, item_id: any) {
    this.token = this.authService.getToken();

    return this.http.get('http://localhost:5000/api/v1.0/homeinventory/' + 
    id + '/duplicate/' + item_id + '?token=' + this.token);
  }

  editItem(item: any, id: any, item_id: any) {
    this.token = this.authService.getToken()
    let postData = new FormData();
    postData.append("item_name", item.item_name);
    postData.append("item_manufacturer", item.item_manufacturer);
    postData.append("item_model", item.item_model);
    postData.append("item_type", item.item_type);
    postData.append("item_img", item.item_image);
    postData.append("serial_no", item.serial_no);
    postData.append("purchase_date", item.purchase_date);
    postData.append("purchase_cost", item.purchase_cost);
    postData.append("estimated_value", item.estimated_value);
    postData.append("item_notes", item.item_notes);

    return this.http.put('http://localhost:5000/api/v1.0/homeinventory/' + 
    id + '/items/' + item_id + '?token=' + this.token, postData);
  }

  deleteItem(id: any, item_id: any) {
    this.token = this.authService.getToken()
    return this.http.delete('http://localhost:5000/api/v1.0/homeinventory/' + 
    id + '/items/' + item_id + '?token=' + this.token);
  }

  exportProperties() {
    this.token = this.authService.getToken()
    this.userid = this.authService.getUser()
    return this.http.get(
      'http://localhost:5000/api/v1.0/homeinventory/export' + '?token=' + this.token + '&userid=' + this.userid
    );
  }

}
