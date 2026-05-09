import { Component, NgModule, OnInit, signal } from '@angular/core';
import { CashierService } from '../cashier-service';
import { CommonModule, NgIf } from '@angular/common';
import JsBarcode from 'jsbarcode';

declare global {
  interface Window {
    electronAPI: any;
  }
}

@Component({
  selector: 'app-checkout',
  imports: [CommonModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {

  constructor(public cashierservice : CashierService){}
  paymentMethod = signal('')
  sufficientAmount = signal(true);

  ngOnInit(): void {
  }

  continuePaymentBtn(amount : HTMLInputElement){

    if(this.cashierservice.totalAmount() <= parseInt(amount.value)){
      this.sufficientAmount.set(true);
      this.cashierservice.payment.set(parseInt(amount.value));
      this.cashierservice.isPrinting.set(true);
      
      setTimeout(() => {
        this.resetTransaction();
      }, 3000);
      
    }else{
      this.sufficientAmount.set(false);
      setTimeout(() => {
        this.sufficientAmount.set(true);
      }, 2000);
      amount.value = '';
    }
  }

  resetTransaction(){
    this.cashierservice.cart.set([]);
    this.paymentMethod.set('');
    this.cashierservice.isCheckOut.set(false);
    this.cashierservice.isPrinting.set(false);
    this.cashierservice.subtotal.set(0);
    this.cashierservice.vat.set(0);
    this.cashierservice.discount.set(0);
    this.cashierservice.totalAmount.set(0);
    this.cashierservice.payment.set(0);
  }
}
