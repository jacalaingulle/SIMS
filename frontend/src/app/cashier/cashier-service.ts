import { Injectable, signal } from '@angular/core';
import { cartInterface, productsInterface } from '../interface/interface';
import { signalUpdateFn } from '@angular/core/primitives/signals';

@Injectable({
  providedIn: 'root',
})
export class CashierService {

  isBrowsingProduct = signal(false);
  isCheckOut = signal(false);
  products = signal<productsInterface[]>([]);
  filteredproducts = signal<productsInterface[]>([]);
  cart = signal<cartInterface[]>([]);
  subtotal = signal<number>(0);
  vat = signal<number>(0);
  checkedVat = signal(false);
  discount = signal<number>(0);
  totalAmount = signal<number>(0);
  transactionId = signal('');
  isPrinting = signal(false);
  time = signal(new Date());

  calculateSummary(){
    this.subtotal.set(0);
    this.discount.set(0);
    this.cart().forEach(item => {
      this.subtotal.set(this.subtotal() + item.totalprice);
      this.discount.set(this.discount() + (item.totalprice * (item.discount / 100)));
    });

    if(this.checkedVat()){
      this.vat.set(this.subtotal() * 0.12);
    }else{
      this.vat.set(0);
    }

    this.totalAmount.set(this.subtotal() + this.vat() - this.discount());
  }

}
