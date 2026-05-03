import { Component, inject } from '@angular/core';
import { Navigation } from '../navigation/navigation';
import { ProductInventory } from '../product-inventory/product-inventory';
import { Service } from '../../service/service';
import { UserSettings } from '../user-settings/user-settings';

@Component({
  selector: 'app-main-component',
  imports: [Navigation, ProductInventory, UserSettings],
  templateUrl: './main-component.html',
  styleUrl: './main-component.css',
})
export class MainComponent {

  public service = inject(Service);
}
