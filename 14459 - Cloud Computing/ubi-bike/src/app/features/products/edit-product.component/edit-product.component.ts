
import { Component, Input } from '@angular/core';
import { ProductsService } from '../products.service';


@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent {
  @Input() name: string;
  @Input() quantity: number | null;
  @Input() stores: string;

  constructor(private productsService: ProductsService) {}

  save() {
    const stores = (this.stores.indexOf(';')) ? this.stores.split(';') : this.stores.split(',');
    this.productsService.save({
      name: this.name,
      quantity: this.quantity,
      stores,
    }).then(() => {
      this.name = '';
      this.stores = '';
      this.quantity = null;
    }).catch(e => alert(e.message));
  }

}
