import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, signal } from '@angular/core';
import { Service } from '../../service/service';
import { cartInterface, productsInterface } from '../../interface/interface';
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
  updatingItem = signal(false);
  selectedItem!: cartInterface;
  checkedWholesale = signal(false);
    
  ngOnInit(): void {
    setInterval(() => {
      this.cashierservice.time.set(new Date());
      this.cdr.detectChanges();
    }, 1000);

    this.cashierservice.transactionId.set(this.cashierservice.time().getTime().toString());
  }

  selectCartItem(item : cartInterface){
    this.selectedItem = item;
    this.updatingItem.set(true);
  }

  updateItem(newqty : HTMLInputElement, wholesale : boolean){
    const cartItem = this.cashierservice.cart().find(item => item.serial === this.selectedItem.serial);

    if(newqty.value === '0' || newqty.value === ''){
      this.cashierservice.cart.set(this.cashierservice.cart().filter(product => product.serial !== cartItem?.serial));
      this.cashierservice.checkedVat.set(false)
    }else{
      if(cartItem){
        
        if(wholesale){
          if(!cartItem.wholesaleApplied){
            cartItem.price = cartItem.wholesalePrice;
            cartItem.wholesaleApplied = true;
            this.checkedWholesale.set(true);
          }
        }else{
          cartItem.price = cartItem.retailPrice;
          cartItem.wholesaleApplied = false;
          this.checkedWholesale.set(false);
        }

        cartItem.qty = parseInt(newqty.value);
        cartItem.totalprice = cartItem.price * cartItem.qty;
      }
    }
    
    this.updatingItem.set(false);
    newqty.value = '';
    this.cashierservice.calculateSummary();
  }

  toggleVat(vat : HTMLInputElement){
    if(vat.checked){
      this.cashierservice.checkedVat.set(true);
    }else{
      this.cashierservice.checkedVat.set(false);
    }

    this.cashierservice.calculateSummary();
  }
}
