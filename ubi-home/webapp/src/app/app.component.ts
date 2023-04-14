import { Component } from "@angular/core";
import { faDoorClosed, faDoorOpen, faLightbulb as fasLightbulb, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { faLightbulb as farLightbulb } from "@fortawesome/free-regular-svg-icons";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseService } from "./firebase.service";
import { SensorStatuses } from "./enums";
import { ISensorStatus } from "./sensor-status.interface";


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  isLoading = true;
  lightIsOn = false;
  doorIsOpen = false;
  temp: number | undefined;
  lux: number | undefined;

  constructor(private firebase: FirebaseService, public auth: AngularFireAuth) {
    [
      {
        docName: "lightStatus",
        collum: SensorStatuses.isOn,
        internalProp: this.lightIsOn
      },
      {
        docName: "doorStatus",
        collum: SensorStatuses.isOpen,
        internalProp: this.doorIsOpen
      },
      {
        docName: "tempStatus",
        collum: SensorStatuses.value,
        internalProp: this.temp
      },
      {
        docName: "luxStatus",
        collum: SensorStatuses.value,
        internalProp: this.lux
      }
    ].forEach((s) => {
      this.subscribeToDeviceStatus(s.docName, s.collum, (res) => {
        if (res !== undefined) {
          s.internalProp = res;
        }
      });
    });
  }

  private subscribeToDeviceStatus(collectionName: string, field: SensorStatuses, cb: (status: boolean | number | undefined) => void): void {
    const statusObservable = this.firebase.getCollection<ISensorStatus>(collectionName).valueChanges();
    statusObservable.subscribe((res) => {
      const statusList = res;
      statusList.sort((a, b) => a.timestamp - b.timestamp)
      const status = statusList.pop();
      cb((status) ? status[field] : undefined);
      this.isLoading = false;
    });
  }

  signIn(): void {
    this.isLoading = true;
    this.firebase.signIn(() => this.isLoading = false)
  }

  signOut(): void {
    this.firebase.signOut();
  }

  getDoorIcon(): IconDefinition {
    return (this.doorIsOpen) ? faDoorOpen : faDoorClosed;
  }

  getLightIcon(): IconDefinition {
    return (this.lightIsOn) ? fasLightbulb : farLightbulb;
  }

  sendCommand(target: string, action: string): void {
    this.isLoading = true;
    this.firebase.sendCommand(target, action);
  } 
}