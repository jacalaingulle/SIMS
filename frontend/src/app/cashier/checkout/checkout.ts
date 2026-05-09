import { Component, NgModule, OnInit, signal } from '@angular/core';
import { CashierService } from '../cashier-service';
import JsBarcode from 'jsbarcode';
import { CommonModule, NgIf } from '@angular/common';

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
  payment = signal(0);

  ngOnInit(): void {
    // this.generateTransacIdBarcode();
  }

  continuePaymentBtn(amount : HTMLInputElement){

    if(this.cashierservice.totalAmount() <= parseInt(amount.value)){
      this.sufficientAmount.set(true);
      this.payment.set(parseInt(amount.value));
      this.cashierservice.isPrinting.set(true);
      this.paymentMethod.set('');
      this.cashierservice.isCheckOut.set(false);
      setTimeout(() => {
        this.cashierservice.cart.set([]);
        this.cashierservice.isPrinting.set(false);
      }, 2000);
    }else{
      this.sufficientAmount.set(false);
      setTimeout(() => {
        this.sufficientAmount.set(true);
      }, 2000);
      amount.value = '';
    }
  }


  // generateTransacIdBarcode(){
  //     JsBarcode('#transaction-barcode', this.cashierservice.transactionId(), {
  //     format: 'CODE128',
  //     lineColor: '#000',
  //     width: 1.5,
  //     height: 60,
  //     fontSize: 15,
  //     displayValue: true
  //   });
  // }
}
