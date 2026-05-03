import { Injectable, signal } from '@angular/core';
import { productsInterface } from '../interface/interface';
import { signalUpdateFn } from '@angular/core/primitives/signals';

@Injectable({
  providedIn: 'root',
})
export class CashierService {

  isBrowsingProduct = signal(false);
  isCheckOut = signal(false);
  products = signal<productsInterface[]>([]);
  filteredproducts = signal<productsInterface[]>([]);
  cart = signal<productsInterface[]>([]);
  subtotal = signal<number>(0);
  vat = signal<number>(0);
  discount = signal<number>(0)
  transactionId = signal('');

}
