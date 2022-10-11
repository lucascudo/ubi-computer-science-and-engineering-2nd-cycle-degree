
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/core/interfaces/product.interface';
import { ProductsService } from './products.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {

  products: Product[];
  editingProduct: Product = {
    name: '',
    quantity: null,
    stores: [],
  };

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.productsService.get().subscribe({
      next: (products: any) => this.products = <Product[]> products,
      error: e => alert(e.message),
    });
  }

  deleteProduct(productName: string) {
    confirm(`Do you really want to delete ${productName}?`) &&
      this.productsService.delete(productName).catch(e => alert(e.message));
  }

  setEditingProduct(product: Product) {
    this.editingProduct = Object.assign({}, product);
  }

  getStores(product: Product): string {
    return product.stores.join(', ');
  }
}
