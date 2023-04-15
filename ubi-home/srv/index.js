import { initializeApp } from 'firebase/app';
import {
  enableIndexedDbPersistence,
  getFirestore
} from 'firebase/firestore';
import five from "johnny-five";
import env from "./env.js";
import Home from './home.class.js';
import setupLogger from './setup-logger.func.js';
import Notificator from './notificator.class.js';

initializeApp(env.firebase);
const db = getFirestore();
enableIndexedDbPersistence(db).catch(() => {});
const logger = setupLogger();
const notificator = new Notificator(env, db, logger);
const home = new Home(env, db, notificator, logger, five);
home.setup();
