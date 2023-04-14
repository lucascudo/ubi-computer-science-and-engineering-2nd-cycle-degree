import { initializeApp } from 'firebase/app';
import {
  enableIndexedDbPersistence,
  getFirestore
} from 'firebase/firestore';
import five from "johnny-five";
import env from "./env.js";
import Home from './home.class.js';
import setupLogger from './setup-logger.func.js';

initializeApp(env.firebase);
const db = getFirestore();
enableIndexedDbPersistence(db).catch(() => {});
const logger = setupLogger();
const home = new Home(env, db, five, logger);
home.setup();
