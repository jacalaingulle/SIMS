import { Component, inject, signal } from '@angular/core';
import { Service } from '../../service/service';

@Component({
  selector: 'app-navigation',
  imports: [],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css',
})
export class Navigation {

  public service = inject(Service);
  navigations = ['📊 Dashboard', '📦 Product Inventory', '🧾 Purchase Order', '📁 User Settings'];
  confirmLogout = signal(false);

  selectNav(index : number){
    this.service.selectedNav.set(index);
  }
}
