import { Component } from "@angular/core";
import { AngularFirestore, DocumentReference } from "@angular/fire/compat/firestore";
import { faDoorClosed, faDoorOpen, faLightbulb as fasLightbulb, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { faLightbulb as farLightbulb } from "@fortawesome/free-regular-svg-icons";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Observable } from "rxjs";


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  isLoading: boolean = true;

  
  lightIsOn: boolean = false;
  doorIsOpen: boolean = false;

  constructor(private firestore: AngularFirestore, public auth: AngularFireAuth) {
    this.subscribeToDeviceStatus("lightStatus" , "isOn", (res: boolean) => this.lightIsOn = res);
    this.subscribeToDeviceStatus("doorStatus" , "isOpen", (res: boolean) => this.doorIsOpen = res);
  }

  private subscribeToDeviceStatus(collectionName: string, field:string, cb: Function): void {
    const statusObservable: Observable<any[]> = this.firestore.collection(collectionName).valueChanges();
    statusObservable.subscribe((res) => {
      const statusList = res;
      statusList.sort((a, b) => a.timestamp - b.timestamp)
      const status = statusList.pop();
      cb((status) ? status[field] : undefined);
      this.isLoading = false;
    });
  }

  login(): void {
    this.isLoading = true;
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
        this.isLoading = false;
      });
    });
  }

  logout(): void {
    this.auth.signOut();
  }

  getDoorIcon(): IconDefinition {
    return (this.doorIsOpen) ? faDoorOpen : faDoorClosed;
  }

  getLightIcon(): IconDefinition {
    return (this.lightIsOn) ? fasLightbulb : farLightbulb;
  }

  sendCommand(target: string, action: string): void {
    this.isLoading = true;
    const requestedAt = new Date();
    this.firestore.collection("commands").add({requestedAt, target, action});
  } 
}