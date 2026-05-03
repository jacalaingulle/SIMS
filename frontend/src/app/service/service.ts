import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { productsInterface, usersInterface } from '../interface/interface';

@Injectable({
  providedIn: 'root',
})
export class Service {

  private httpclient = inject(HttpClient);

  selectedNav = signal<number>(0);
  loggedUser!: usersInterface;
  productsURL = "http://localhost:3000/products/";
  usersURL = "http://localhost:3000/users/";
  validLogin = signal(false);
  confirmationMsg = signal('');

  getProducts(){
    return this.httpclient.get<productsInterface[]>(this.productsURL);
  }

  addProduct(product : productsInterface){
    return this.httpclient.post(this.productsURL, product);
  }

  updateProduct(product: productsInterface, id : number){
    return this.httpclient.put(this.productsURL + id, product);
  }

  deleteProduct(id: number){
    return this.httpclient.delete(this.productsURL + id);
  }

  getUsers(){
    return this.httpclient.get<usersInterface[]>(this.usersURL);
  }

  addUser(user : usersInterface){
    return this.httpclient.post(this.usersURL, user);
  }

  updateUser(user: usersInterface, id: number){
    return this.httpclient.put(this.usersURL + id, user);
  }

  removeUser(id : number){
    return this.httpclient.delete(this.usersURL + id);
  }
}
