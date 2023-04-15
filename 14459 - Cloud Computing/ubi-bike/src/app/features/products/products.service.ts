import {Injectable, OnInit} from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { BaseFirestoreService } from 'src/app/core/services/base-firestore.service';

@Injectable()
export class ProductsService extends BaseFirestoreService{

  constructor(store: Firestore) {
    super(store, 'products');
  }
}
