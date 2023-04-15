export default class Notificator {

	constructor(env, db, logger, firestore, webPush) {
        const { mailto, publicKey, privateKey } = env.vapid;
        webPush.setVapidDetails(`mailto:${mailto}`, publicKey, privateKey);
		this.db = db;
		this.logger = logger;
        this.firestore = firestore;
        this.webPush = webPush;
	}

    db;
	logger;
    firestore;
    webPush;

    async push(message) {
        const subscribers = [];
        const collectionSnap = await this.firestore.getDocs(this.firestore.collection(this.db, "subscribers"));
        collectionSnap.forEach(s => subscribers.push({
            subId: s.id,
            subUser: s.data().user,
            subInfo: JSON.parse(s.data().subInfo)
        }));
        this.logger.info(`Pushing notification "${message}" to ${subscribers.length} subscribers`);
        const notificationPayload = {
            "notification": {
                "title": "UBI Home Alert",
                "body": message,
                "icon": "https://ubi-61a39.web.app/assets/icons/icon-72x72.png",
                "vibrate": [100, 50, 100],
                "data": {
                    "dateOfArrival": Date.now(),
                    "primaryKey": 1
                }
            }
        };

        Promise.all(subscribers.map(async s => {
            return await this.webPush.sendNotification(s.subInfo, JSON.stringify(notificationPayload))
            .then(() => this.logger.info(`Pushed notification to ${s.subUser} (${s.subId}) successfully`))
            .catch(err => {
                this.logger.error(`Error pushing notification to ${s.subUser} (${s.subId}), reason: ${err}`);
                if (err.code !== "ETIMEDOUT") {
                    this.logger.warn(`Removing ${s.subId} from the subscribers list`);
                    this.firestore.deleteDoc(this.firestore.doc(this.db, "subscribers", s.subId));
                }
            })
        })).finally(() =>  this.logger.info(`Finished to push notification "${message}"`));
    }
}