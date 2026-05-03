import { Component, inject, OnInit, signal } from '@angular/core';
import { Service } from '../../service/service';
import { productsInterface } from '../../interface/interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';

@Component({
  selector: 'app-product-inventory',
  imports: [ReactiveFormsModule],
  templateUrl: './product-inventory.html',
  styleUrl: './product-inventory.css',
})
export class ProductInventory implements OnInit {

  public service = inject(Service);
  
  viewAllProducts = signal(true);
  viewShoppingCart = signal(false);
  viewProdInfo = signal(false);
  viewAddUpdateModal = signal(false);
  viewConfirmationModal = signal(false);
  products = signal<productsInterface[]>([]);
  filteredProducts = signal<productsInterface[]>([]);
  selectedProduct!: productsInterface;
  searchText = new FormControl('');
  isAddingProduct = signal(false);
  isUpdatingProduct = signal(false);
  productForm!: FormGroup;
  productData!: productsInterface;
  addUpdateModalHeaderText: string = '';
  addUpdateModalBtnText: string = '';

  ngOnInit(): void {
    this.service.getProducts().subscribe(data => {
      this.products.set(data);
      this.filteredProducts.set(data);
    });

    this.searchText.valueChanges.pipe(debounceTime(700), distinctUntilChanged()).subscribe( value => {
      const search = (value ?? '').trim().toLowerCase();

      if(!search){
        this.filteredProducts.set(this.products());
        return;
      }

      this.filteredProducts.set(this.products().filter( prod =>
          prod.id.toString().includes(search) ||
          prod.serial.toString().includes(search) ||
          prod.brand.toLowerCase().includes(search) ||
          prod.name.toLowerCase().includes(search) ||
          prod.category.toLowerCase().includes(search) ||
          prod.qty.toString().includes(search) ||
          prod.unit.toLowerCase().includes(search) ||
          prod.unitCost.toString().includes(search) ||
          prod.discount.toString().includes(search) ||
          prod.retailPrice.toString().includes(search) ||
          prod.wholesalePrice.toString().includes(search)
        ));
      });

    this.productForm = new FormGroup({
        brand: new FormControl('', Validators.required),
        name: new FormControl('', Validators.required),
        category: new FormControl('', Validators.required),
        qty: new FormControl('', Validators.required),
        unit: new FormControl('', Validators.required),
        unitCost: new FormControl('', Validators.required),
        discount: new FormControl('', Validators.required),
        retailPrice: new FormControl('', Validators.required),
        wholesalePrice: new FormControl('', Validators.required)
      });
  }

  selectAllProducts(){
    this.viewAllProducts.set(true);
    this.viewShoppingCart.set(false);
  }

  selectShoppingCart(){
    this.viewAllProducts.set(false);
    this.viewShoppingCart.set(true);
  }

  infoModal(product : productsInterface){
    this.viewProdInfo.set(true);
    this.selectedProduct = product;
  }

  addProduct(){
    this.isAddingProduct.set(true);
    this.isUpdatingProduct.set(false);
    this.viewAddUpdateModal.set(true);
    this.addUpdateModalHeaderText = "Add Product";
    this.addUpdateModalBtnText = "Add Product";
  }

  updateProduct(){
    this.isAddingProduct.set(false);
    this.isUpdatingProduct.set(true);
    this.viewAddUpdateModal.set(true);
    this.viewProdInfo.set(false);
    this.addUpdateModalHeaderText = "Update Product";
    this.addUpdateModalBtnText = "Save Changes"

    this.productForm.patchValue({
      brand: this.selectedProduct.brand,
      name: this.selectedProduct.name,
      category: this.selectedProduct.category,
      qty: this.selectedProduct.qty,
      unit: this.selectedProduct.unit,
      unitCost: this.selectedProduct.unitCost,
      discount: this.selectedProduct.discount,
      retailPrice: this.selectedProduct.retailPrice,
      wholesalePrice: this.selectedProduct.wholesalePrice
    });
  }

  deleteProduct(){
    this.viewConfirmationModal.set(true);
    this.service.confirmationMsg.set('Are you sure you want to delete this product ?')
    console.log(this.isAddingProduct())
    console.log(this.isUpdatingProduct());
  }

  closeAddUpdateModal(){
    this.isAddingProduct.set(false);
    this.isUpdatingProduct.set(false);
    this.viewAddUpdateModal.set(false);
    this.productForm.reset();
  }

  submitBtn(){
    if(this.isAddingProduct()){
      this.productData = {
        id: this.products().length + 1,
        serial: parseInt(this.productForm.value.brand[0].toUpperCase().charCodeAt() + Date.now().toString().slice(-6)),
        brand: this.productForm.value.brand,
        name: this.productForm.value.name,
        category: this.productForm.value.category,
        qty: this.productForm.value.qty,
        unit: this.productForm.value.unit,
        unitCost: this.productForm.value.unitCost,
        discount: this.productForm.value.discount,
        retailPrice: this.productForm.value.retailPrice,
        wholesalePrice: this.productForm.value.wholesalePrice
      };

      this.service.addProduct(this.productData).subscribe({
        next : response => {
          this.service.getProducts().subscribe( data => {
            this.products.set(data);
            this.filteredProducts.set(data);
          });
          this.closeAddUpdateModal();
        }
      });
    }
    else{
      this.viewConfirmationModal.set(true);
      this.service.confirmationMsg.set('Are you sure you want to update this product ?');
    }
  }

  continueAction(){
    if(this.isUpdatingProduct()){
      this.productData = {
        id: this.selectedProduct.id,
        serial: this.selectedProduct.serial,
        brand: this.productForm.value.brand,
        name: this.productForm.value.name,
        category: this.productForm.value.category,
        qty: this.productForm.value.qty,
        unit: this.productForm.value.unit,
        unitCost: this.productForm.value.unitCost,
        discount: this.productForm.value.discount,
        retailPrice: this.productForm.value.retailPrice,
        wholesalePrice: this.productForm.value.wholesalePrice
      }
      
      this.service.updateProduct(this.productData, this.productData.id).subscribe({
        next : response => {
          this.service.getProducts().subscribe( data => {
            this.products.set(data);
            this.filteredProducts.set(data);
          });
          this.closeAddUpdateModal();
          this.viewConfirmationModal.set(false);
        }
      })
    }

    else{
      this.service.deleteProduct(this.selectedProduct.id).subscribe({
        next : response => {
          this.service.getProducts().subscribe(data => {
            this.products.set(data);
            this.filteredProducts.set(data);
          });
          this.viewProdInfo.set(false);
          this.viewConfirmationModal.set(false);
        }
      });
    }
  }
}
