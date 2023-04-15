import { initializeApp } from 'firebase/app';
import * as firestore from 'firebase/firestore';
import five from "johnny-five";
import webPush from "web-push";
import winston from 'winston';
import env from "./env.js";
import Home from './home.class.js';
import Notificator from './notificator.class.js';
import setupLogger from './setup-logger.func.js';


initializeApp(env.firebase);
const db = firestore.getFirestore();
const logger = setupLogger(winston);
const notificator = new Notificator(env, db, logger, firestore, webPush);
const home = new Home(env, db, logger, firestore, notificator, five);
home.setup();
