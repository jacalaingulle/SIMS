import { Component } from '@angular/core';
import { CashierService } from '../cashier-service';
import { productsInterface } from '../../interface/interface';

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
      category: product.category,
      qty: 1,
      unit: product.unit,
      unitCost: product.unitCost,
      discount: product.discount,
      retailPrice: product.retailPrice,
      wholesalePrice: product.wholesalePrice
    }

    if(!exists){
      this.cashierservice.cart().push(prodData);
    }else{
      const i = this.cashierservice.cart().findIndex(item => item.serial === prodData.serial);
      this.cashierservice.cart()[i].qty =  this.cashierservice.cart()[i].qty += 1;
    }

    this.calculateTotal();
    this.cashierservice.isBrowsingProduct.set(false);
  }

  calculateTotal(){
    this.cashierservice.subtotal.set(this.cashierservice.cart().reduce((sum, item) => sum + (item.qty < 5 ? item.retailPrice * item.qty : item.wholesalePrice * item.qty), 0))
    this.cashierservice.vat.set(this.cashierservice.subtotal() !== 0 ? this.cashierservice.subtotal() * 0.12 : 0);
  }

}
