import { Component } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { faDoorClosed, faDoorOpen, faLightbulb as fasLightbulb, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { faLightbulb as farLightbulb } from "@fortawesome/free-regular-svg-icons";
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

  constructor(private firestore: AngularFirestore) {
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

  getDoorIcon(): IconDefinition {
    return (this.doorIsOpen) ? faDoorOpen : faDoorClosed;
  }

  getLightIcon(): IconDefinition {
    return (this.lightIsOn) ? fasLightbulb : farLightbulb;
  }

  sendCommand(target: string, action: string): void {
    this.isLoading = true;
    const requestedAt = new Date();
    const commands = this.firestore.collection("commands");
    commands.add({requestedAt, target, action});
  }
}
