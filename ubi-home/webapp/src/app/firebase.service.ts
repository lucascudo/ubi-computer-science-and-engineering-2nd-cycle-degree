import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { SensorCollections } from './enums';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth) { }

  getCollection<T>(collectionName: SensorCollections) {
    return this.firestore.collection<T>(collectionName);
  }

  signIn(cb: (user: firebase.auth.UserCredential) => void) {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(async (credential: firebase.auth.UserCredential) => {
      this.firestore.doc(`users/${credential.user?.email}`).get().subscribe(user => {
        if (user.exists) {
          this.firestore.doc(user.ref as DocumentReference).update({ lastLogin: new Date() });
        } else {
          this.auth.signOut();
          this.firestore.collection("unauthorizedLogins").add({
            timestamp: new Date(),
            user: {
              displayName: credential.user?.displayName,
              email: credential.user?.email,
              photoURL: credential.user?.photoURL
            }
          });
        }
        cb(credential);
      });
    });
  }
  
  signOut(): void {
    this.auth.signOut();
  }

  sendCommand(target: string, action: string): void {
    const requestedAt = new Date();
    this.auth.user.subscribe(u => {
      if (!u) return;
      const user = u.email;
      this.firestore.collection("commands").add({requestedAt, target, action, user});
    });
  }
}
