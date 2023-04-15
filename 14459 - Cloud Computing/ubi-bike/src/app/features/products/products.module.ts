import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { DataViewModule } from 'primeng/dataview';
import { ProductsComponent } from './products.component';
import { ProductsService } from './products.service';
import { MatIconModule } from '@angular/material/icon';
import { EditProductComponent } from './edit-product.component/edit-product.component';
import { MatButtonModule } from '@angular/material/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { BaseModule } from 'src/app/core/base.component/base.module';



@NgModule({
  declarations: [
    ProductsComponent,
    EditProductComponent,
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    BaseModule,
    FormsModule,
    DataViewModule,
    MatIconModule,
    MatButtonModule,
    InputTextModule,
  ],
  providers: [
    ProductsService,
  ]
})
export class ProductsModule { }
