import { Injectable } from "@angular/core";
import { SwPush } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { FirebaseService } from "./firebase.service";
import { DeviceDetectorService } from 'ngx-device-detector';
import { AngularFireAuth } from "@angular/fire/compat/auth";

@Injectable({
  providedIn: "root"
})
export class NotificationServiceService {

  constructor(
    private _swPush: SwPush,
    private _firebase: FirebaseService,
    private _deviceService: DeviceDetectorService,
    private _auth: AngularFireAuth) { }

  async addPushSubscriber(sub: unknown) {
    this._auth.user.subscribe(u => {
      if (!u) return;
      const user = u.email;
      const collectionName = "subscribers";
      const subInfo = JSON.stringify(sub);
      const deviceInfo = JSON.stringify(this._deviceService.getDeviceInfo());
      const fingerprint = window.btoa(deviceInfo).substring(0, 20);
      this._firebase.getDocument(`${collectionName}/${fingerprint}`, subscriber => {
        if (!subscriber.exists) {
          this._firebase.addToCollection(collectionName, {
            subInfo,
            deviceInfo,
            user
          }, fingerprint);
        }
      });
    });
  }

  subscribeToNotifications() {
    const serverPublicKey = environment.vapidPublicKey;
    this._swPush.requestSubscription({ serverPublicKey })
    .then(sub => this.addPushSubscriber(sub))
    .catch(err => console.error("Could not subscribe to notifications", err));
  }
}
