import { Injectable } from "@angular/core";
import { SwPush } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { FirebaseService } from "./firebase.service";
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: "root"
})
export class NotificationServiceService {

  constructor(private _swPush: SwPush, private _firebase: FirebaseService, private _deviceService: DeviceDetectorService) { }

  async addPushSubscriber(sub: unknown) {
    const collectionName = "subscribers";
    const subInfo = JSON.stringify(sub);
    const deviceInfo = JSON.stringify(this._deviceService.getDeviceInfo());
    const fingerprint = window.btoa(deviceInfo).substring(0, 20);
    this._firebase.getDocument(`${collectionName}/${fingerprint}`, subscriber => {
      if (!subscriber.exists) {
        this._firebase.addToCollection(collectionName, {
          subInfo,
          deviceInfo
        }, fingerprint);
      }
    });
  }

  subscribeToNotifications() {
    const serverPublicKey = environment.vapidPublicKey;
    this._swPush.requestSubscription({ serverPublicKey })
    .then(sub => this.addPushSubscriber(sub))
    .catch(err => console.error("Could not subscribe to notifications", err));
  }
}
