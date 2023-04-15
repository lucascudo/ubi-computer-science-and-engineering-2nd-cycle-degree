import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { SensorCollections } from '../enums';
import { Observable } from 'rxjs';
import {DeviceService} from "./device.service";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private _firestore: AngularFirestore,
    private _auth: AngularFireAuth,
    private _deviceService: DeviceService
  ) { }

  getCollection<T>(collectionName: SensorCollections) {
    return this._firestore.collection<T>(collectionName);
  }

  getDocument<T>(documentPath: string): Observable<firebase.firestore.DocumentSnapshot<T>> {
      return this._firestore.doc<T>(documentPath).get();
  }

  async setDocument(collectionName: string, document:unknown, docId?: string): Promise<DocumentReference<unknown>> {
    const collection = this._firestore.collection(collectionName);
    if (docId) {
      collection.doc(docId).set(document);
      return this._firestore.doc(`${collectionName}/${docId}`).ref;
    }
    return collection.add(document);
  }

  setSubscriber(sub: PushSubscription): void {
    this._auth.user.subscribe(u => {
      if (!u) return;
      const user = u.email;
      const collectionName = "subscribers";
      const timestamp = new Date();
      const subInfo = JSON.stringify(sub);
      const deviceInfo = this._deviceService.getInfo();
      const fingerprint = this._deviceService.getFingerprint();
      this.getDocument(`${collectionName}/${fingerprint}`).subscribe(subscriber => {
        if (!subscriber.exists) {
          this.setDocument(collectionName, {
            timestamp,
            subInfo,
            deviceInfo,
            user
          }, fingerprint);
        }
      });
    });
  }

  sendCommand(target: string, action: string): void {
    const requestedAt = new Date();
    this._auth.user.subscribe(u => {
      if (!u) return;
      const user = u.email;
      const deviceInfo = this._deviceService.getInfo();
      this._firestore.collection("commands").add({requestedAt, target, action, user, deviceInfo});
    });
  }

  signIn(callback: (success: boolean, user?: firebase.auth.UserCredential) => void): void {
    this._auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(async (credential: firebase.auth.UserCredential) => {
      this._firestore.doc(`users/${credential.user?.email}`).get().subscribe(user => {
        if (user.exists) {
          this._firestore.doc(user.ref as DocumentReference).update({ lastLogin: new Date() });
        } else {
          this._auth.signOut();
          this._firestore.collection("unauthorizedLogins").add({
            timestamp: new Date(),
            user: {
              displayName: credential.user?.displayName,
              email: credential.user?.email,
              photoURL: credential.user?.photoURL,

            }
          });
        }
        callback(user.exists, credential);
      });
    }).catch(err => {
      console.error(err);
      callback(false);
    });
  }

  signOut(): void {
    this._auth.signOut();
  }
}
