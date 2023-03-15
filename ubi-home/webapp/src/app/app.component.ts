import { Component } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { faDoorClosed, faDoorOpen, faLightbulb as fasLightbulb } from "@fortawesome/free-solid-svg-icons";
import { faLightbulb as farLightbulb } from "@fortawesome/free-regular-svg-icons";
import { Observable } from "rxjs";


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {

  lightStatusList: Observable<any[]>;
  lightIsOn: boolean = false;

  doorStatusList: Observable<any[]>;
  doorIsOpen: boolean = false;

  constructor(private firestore: AngularFirestore) {
    this.lightStatusList = firestore.collection("lightStatus").valueChanges();
    this.lightStatusList.subscribe(
      (res) => this.lightIsOn = res.sort((a, b) => a.timestamp - b.timestamp).pop().isOn);

    this.doorStatusList = firestore.collection("doorStatus").valueChanges();
    this.doorStatusList.subscribe(
      (res) => this.doorIsOpen = res.sort((a, b) => a.timestamp - b.timestamp).pop().isOpen);
  }

  getDoorIcon() {
    return (this.doorIsOpen) ? faDoorOpen : faDoorClosed;
  }

  getLightIcon() {
    return (this.lightIsOn) ? fasLightbulb : farLightbulb;
  }

  sendCommand(target: string, action: string) {
    const timestamp = new Date();
    const commands = this.firestore.collection("commands");
    commands.add({timestamp, target, action});
  }
}
