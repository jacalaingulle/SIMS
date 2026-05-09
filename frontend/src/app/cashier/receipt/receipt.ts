import { Component, OnInit } from '@angular/core';
import { CashierService } from '../cashier-service';
import { Service } from '../../service/service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-receipt',
  imports: [CommonModule],
  templateUrl: './receipt.html',
  styleUrl: './receipt.css',
})
export class Receipt implements OnInit {

  constructor(public cashierservice : CashierService, public service : Service){}

  ngOnInit(): void {
    window.electronAPI.printReceipt();
  }
}
