import { Component } from '@angular/core';
import { CashierService } from '../cashier-service';
import { cartInterface, productsInterface } from '../../interface/interface';

@Component({
  selector: 'app-product-list',
  imports: [],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {

  constructor(public cashierservice : CashierService){}

  selectProduct(product : productsInterface){

    const exists = this.cashierservice.cart().some(item => item.serial === product.serial)

    const prodData = {
      id: product.id,
      serial: product.serial,
      brand: product.brand,
      name: product.name,
      qty: 1,
      unit: product.unit,
      discount: product.discount,
      price: product.retailPrice - (product.retailPrice * (product.discount / 100)),
      totalprice: product.retailPrice - (product.retailPrice * (product.discount / 100)),
      retailPrice: product.retailPrice - (product.retailPrice * (product.discount / 100)),
      wholesalePrice: product.wholesalePrice - (product.wholesalePrice * (product.discount / 100)),
      wholesaleApplied : false
    }

    if(!exists){
      this.cashierservice.cart().push(prodData);
    }else{
      const i = this.cashierservice.cart().findIndex(item => item.serial === prodData.serial);
      this.cashierservice.cart()[i].qty =  this.cashierservice.cart()[i].qty += 1;
      this.cashierservice.cart()[i].totalprice = this.cashierservice.cart()[i].price * this.cashierservice.cart()[i].qty;
    }

    this.cashierservice.isBrowsingProduct.set(false);
    this.cashierservice.calculateSummary();
  }

}
