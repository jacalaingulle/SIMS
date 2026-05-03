import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CashierService } from '../cashier-service';
import { Service } from '../../service/service';

@Component({
  selector: 'app-cashier-navigations',
  imports: [CommonModule],
  templateUrl: './cashier-navigations.html',
  styleUrl: './cashier-navigations.css',
})
export class CashierNavigations implements OnInit {

  constructor(public cashierservice : CashierService, public service : Service, private cdr : ChangeDetectorRef){}

  @Output() browseInputClick = new EventEmitter<boolean>();

  ngOnInit(): void {
    setInterval(() => {
      
    }, 1000);
  }
}
