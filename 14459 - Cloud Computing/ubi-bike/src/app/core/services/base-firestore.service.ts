import { Firestore, collectionData, collection, doc, setDoc, deleteDoc } from '@angular/fire/firestore';

export class BaseFirestoreService {

    private collectionName: string;

    constructor(private store: Firestore, collectionName: string) {
      this.collectionName = collectionName;
    }

    get() {
      return collectionData(collection(this.store, this.collectionName));
    }

    save(item: any) {
      return setDoc(doc(this.store, this.collectionName, item.name), item);
    }

    delete(itemId: string) {
      return deleteDoc(doc(this.store, this.collectionName, itemId));
    }
}
