import { Component, OnInit, signal } from '@angular/core';
import { CashierNavigations } from '../cashier-navigations/cashier-navigations';
import { CashierCart } from '../cashier-cart/cashier-cart';
import { CashierService } from '../cashier-service';
import { ProductList } from '../product-list/product-list';
import { Service } from '../../service/service';
import { Checkout } from '../checkout/checkout';
import { CommonModule } from '@angular/common';
import { Receipt } from '../receipt/receipt';

@Component({
  selector: 'app-cashier-main',
  imports: [CashierNavigations, CashierCart, ProductList, Checkout, CommonModule, Receipt],
  templateUrl: './cashier-main.html',
  styleUrl: './cashier-main.css',
})
export class CashierMain implements OnInit{
  
  constructor(public cashierservice : CashierService, public service : Service){}

  ngOnInit(): void {
    this.service.getProducts().subscribe( data => {
      this.cashierservice.products.set(data);
      this.cashierservice.filteredproducts.set(data);
    });
  }
}
