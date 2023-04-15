import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { BaseFirestoreService } from 'src/app/core/services/base-firestore.service';

@Injectable({
  providedIn: 'root'
})
export class AchievementsService extends BaseFirestoreService {
  constructor(store: Firestore) {
    super(store, 'achievements');
  }
}
