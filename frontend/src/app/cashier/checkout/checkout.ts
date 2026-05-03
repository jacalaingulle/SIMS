import { Component, OnInit } from '@angular/core';
import { CashierService } from '../cashier-service';
import JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-checkout',
  imports: [],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {

  constructor(public cashierservice : CashierService){}
  date = new Date()

  ngOnInit(): void {
    this.generateTransacIdBarcode();
  }

  generateTransacIdBarcode(){
      JsBarcode('#transaction-barcode', this.cashierservice.transactionId(), {
      format: 'CODE128',
      lineColor: '#000',
      width: 1.5,
      height: 60,
      fontSize: 15,
      displayValue: true
    });
  }
}
