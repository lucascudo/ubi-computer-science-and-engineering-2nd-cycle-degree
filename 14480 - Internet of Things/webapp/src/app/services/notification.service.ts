import { Injectable } from "@angular/core";
import { SwPush } from "@angular/service-worker";
import { environment } from "../../environments/environment";
import { FirebaseService } from "./firebase.service";

@Injectable({
  providedIn: "root"
})
export class NotificationService {

  constructor(
    private _swPush: SwPush,
    private _firebase: FirebaseService) { }

  subscribeToNotifications(): Promise<PushSubscription | void> {
    const serverPublicKey = environment.vapidPublicKey;
    return this._swPush.requestSubscription({ serverPublicKey })
      .then(sub => {
        this._firebase.setSubscriber(sub);
        return sub;
      })
      .catch(err => console.error("Could not subscribe to notifications", err));
  }
}
