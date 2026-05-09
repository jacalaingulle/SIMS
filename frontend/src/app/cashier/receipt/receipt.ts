import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CashierService } from '../cashier-service';
import { Service } from '../../service/service';
import { CommonModule } from '@angular/common';
import JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-receipt',
  imports: [CommonModule],
  templateUrl: './receipt.html',
  styleUrl: './receipt.css',
})
export class Receipt implements AfterViewInit {

  constructor(public cashierservice : CashierService, public service : Service){}

  ngAfterViewInit(): void {
    this.generateTransacIdBarcode();
    window.electronAPI.printReceipt();
  }

  generateTransacIdBarcode(){
      JsBarcode('#barcode', this.cashierservice.transactionId(), {
      format: 'CODE128',
      lineColor: '#000',
      width: 1.58,
      height: 30,
      fontSize: 10,
      displayValue: false
    });
  }
}
