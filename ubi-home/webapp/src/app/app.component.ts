import { Component } from "@angular/core";
import { faDoorClosed, faDoorOpen, faLightbulb as fasLightbulb, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { faLightbulb as farLightbulb } from "@fortawesome/free-regular-svg-icons";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseService } from "./firebase.service";
import { SensorStatuses } from "./enums";
import ISensorStatus from "./sensor-status.interface";
import { SensorCollections } from "./enums";


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  isLoading: boolean | undefined = true;
  lightIsOn: boolean | undefined = false;
  doorIsOpen: boolean | undefined = false;
  temp: number | undefined;
  lux: number | undefined;

  constructor(private firebase: FirebaseService, public auth: AngularFireAuth) {
    [
      {
        docName: SensorCollections.lightStatus,
        collum: SensorStatuses.isOn,
        cb: (res: boolean | undefined) => this.lightIsOn = res
      },
      {
        docName: SensorCollections.doorStatus,
        collum: SensorStatuses.isOpen,
        cb: (res: boolean | undefined) => this.doorIsOpen = res
      },
      {
        docName: SensorCollections.tempStatus,
        collum: SensorStatuses.value,
        cb: (res: number | undefined) => this.temp = res
      },
      {
        docName: SensorCollections.luxStatus,
        collum: SensorStatuses.value,
        cb: (res: number | undefined) => this.lux = res
      }
    ].forEach((s) => {
      console.log(s.collum);
      this.subscribeToDeviceStatus(s.docName, s.collum, (res) => {
        if (res !== undefined) {
          s.cb(res as never);
        }
      });
    });
  }

  private subscribeToDeviceStatus(collectionName: SensorCollections, field: SensorStatuses, cb: (status: boolean | number | undefined) => void): void {
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