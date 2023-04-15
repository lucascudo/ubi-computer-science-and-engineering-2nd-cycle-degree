import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  faDoorClosed,
  faDoorOpen,
  faLightbulb as fasLightbulb,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { faLightbulb as farLightbulb } from "@fortawesome/free-regular-svg-icons";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseService } from "./firebase.service";
import ISensorStatus from "./sensor-status.interface";
import { SensorCollections, SensorStatuses } from "./enums";
import { Subscription } from "rxjs";
import { NgcCookieConsentService } from "ngx-cookieconsent";
import {MatSnackBar, MatSnackBarRef, TextOnlySnackBar} from '@angular/material/snack-bar';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, OnDestroy {

  isLoading: boolean | undefined = true;
  lightIsOn: boolean | undefined = false;
  doorIsOpen: boolean | undefined = false;
  temp: number | undefined;
  lux: number | undefined;
  private subscriptions: Subscription[] = [];

  constructor(
    private _firebase: FirebaseService,
    private _ccService: NgcCookieConsentService,
    private _snackBar: MatSnackBar,
    public auth: AngularFireAuth){ }

  private subscribeToDeviceStatus(collectionName: SensorCollections, field: SensorStatuses, cb: (status: boolean | number | undefined) => void): Subscription {
    const statusObservable = this._firebase.getCollection<ISensorStatus>(collectionName).valueChanges();
    return statusObservable.subscribe((res: ISensorStatus[]) => {
      const statusList = res;
      statusList.sort((a, b) => a.timestamp - b.timestamp)
      const status = statusList.pop();
      cb((status) ? status[field] : undefined);
      this.isLoading = false;
    });
  }

  ngOnInit() {
    [
      {
        docName: SensorCollections.lightStatus,
        colum: SensorStatuses.isOn,
        cb: (res: boolean | undefined) => this.lightIsOn = res
      },
      {
        docName: SensorCollections.doorStatus,
        colum: SensorStatuses.isOpen,
        cb: (res: boolean | undefined) => this.doorIsOpen = res
      },
      {
        docName: SensorCollections.tempStatus,
        colum: SensorStatuses.value,
        cb: (res: number | undefined) => this.temp = res
      },
      {
        docName: SensorCollections.luxStatus,
        colum: SensorStatuses.value,
        cb: (res: number | undefined) => this.lux = res
      }
    ].forEach((s, i) => {
      console.log(s.colum);
      this.subscriptions[i] = this.subscribeToDeviceStatus(s.docName, s.colum, (res) => {
        if (res !== undefined) {
          s.cb(res as never);
        }
      });
    });
  }

  ngOnDestroy() {
    // unsubscribe to observables to prevent memory leaks
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  getDoorIcon(): IconDefinition {
    return (this.doorIsOpen) ? faDoorOpen : faDoorClosed;
  }

  getLightIcon(): IconDefinition {
    return (this.lightIsOn) ? fasLightbulb : farLightbulb;
  }

  openSnackBar(message: string, action = "dismiss"): MatSnackBarRef<TextOnlySnackBar> {
    return this._snackBar.open(message, action, {
      verticalPosition: "top",
      duration: 5000
    });
  }

  sendCommand(target: string, action: string): void {
    this.openSnackBar(`Sending command: ${action} ${target}`);
    this.isLoading = true;
    this._firebase.sendCommand(target, action);
  }

  signIn(): void {
    this.isLoading = true;
    this._firebase.signIn((success, credential) => {
      const errorMessage = "Unauthorized: this login attempt will be reported!";
      const successMessage = `Welcome ${credential.user?.displayName}!`;
      this.openSnackBar(success ? successMessage : errorMessage);
      this.isLoading = false;
    });
  }

  signOut(): void {
    this._firebase.signOut();
  }
}
