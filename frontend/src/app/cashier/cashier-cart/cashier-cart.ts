import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, signal } from '@angular/core';
import { Service } from '../../service/service';
import { productsInterface } from '../../interface/interface';
import { CashierService } from '../cashier-service';
import { ɵInternalFormsSharedModule } from "@angular/forms";

@Component({
  selector: 'app-cashier-cart',
  imports: [CommonModule, ɵInternalFormsSharedModule],
  templateUrl: './cashier-cart.html',
  styleUrl: './cashier-cart.css',
})
export class CashierCart implements OnInit{

  @Input() browseProd!: boolean;

  constructor(private cdr : ChangeDetectorRef, public service : Service, public cashierservice : CashierService){}

  retail = signal(false);
  time = signal(new Date());
  transactionId = signal('');
  updatingQty = signal(false);
  selectedItem!: productsInterface;
  
  ngOnInit(): void {
    setInterval(() => {
      this.time.set(new Date());
      this.cdr.detectChanges();
    }, 1000);

    this.transactionId.set(this.time().getTime().toString());
  }

  selectCartItem(item : productsInterface){
    this.selectedItem = item;
    this.updatingQty.set(true);
  }

  changeQty(newqty : HTMLInputElement){
    const item = this.cashierservice.cart().find(product => product.serial === this.selectedItem.serial);

    if(item){
      item.qty = parseInt(newqty.value);
    }
    
    this.updatingQty.set(false);
    newqty.value = '';

    this.cashierservice.subtotal.set(this.cashierservice.cart().reduce((sum, item) => sum + (item.qty >= 5 ? item.retailPrice * item.qty : item.wholesalePrice * item.qty), 0))
  }

}
