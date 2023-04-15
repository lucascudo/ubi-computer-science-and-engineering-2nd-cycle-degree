import webpush from "web-push";
import { collection, getDocs } from 'firebase/firestore';

export default class Notificator {

	constructor(env, db, logger) {
        const { mailto, publicKey, privateKey } = env.vapid;
        webpush.setVapidDetails(`mailto:${mailto}`, publicKey, privateKey);
		this.db = db;
		this.logger = logger;
	}

    db;
	logger;

    async push(message) {
        const subscribers = [];
        const collectionSnap = await getDocs(collection(this.db, "subscribers"));
        collectionSnap.forEach(s => subscribers.push(JSON.parse(s.data().subInfo)));
        this.logger.info(`Pushing notification to ${subscribers.length} subscribers`);
        const notificationPayload = {
            "notification": {
                "title": "UBI Home Alert",
                "body": message,
                //"icon": "assets/main-page-logo-small-hat.png",
                "vibrate": [100, 50, 100],
                "data": {
                    "dateOfArrival": Date.now(),
                    "primaryKey": 1
                },
                "actions": [{
                    "action": "explore",
                    "title": "See in the site"
                }]
            }
        };

        Promise.all(subscribers.map(sub => webpush.sendNotification(
            sub, JSON.stringify(notificationPayload) )))
            .then(() => this.logger.info(`Pushed notification to ${subscribers.length} subscribers successfully`))
            .catch(err => {
                this.logger.error("Error sending notification, reason: ");
                this.logger.error(err);
            });
    }
}