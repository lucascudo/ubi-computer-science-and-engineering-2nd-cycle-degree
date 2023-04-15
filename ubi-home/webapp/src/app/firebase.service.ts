import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { SensorCollections } from './enums';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private _firestore: AngularFirestore, private _auth: AngularFireAuth) { }

  getCollection<T>(collectionName: SensorCollections) {
    return this._firestore.collection<T>(collectionName);
  }

  sendCommand(target: string, action: string): void {
    const requestedAt = new Date();
    this._auth.user.subscribe(u => {
      if (!u) return;
      const user = u.email;
      this._firestore.collection("commands").add({requestedAt, target, action, user});
    });
  }

  signIn(cb: (success: boolean, user: firebase.auth.UserCredential) => void) {
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
              photoURL: credential.user?.photoURL
            }
          });
        }
        cb(user.exists, credential);
      });
    });
  }
  
  signOut(): void {
    this._auth.signOut();
  }
}
