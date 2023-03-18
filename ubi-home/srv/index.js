import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  enableIndexedDbPersistence,
  onSnapshot,
  collection,
  addDoc,
  updateDoc
} from 'firebase/firestore';
import winston from 'winston';
import five from "johnny-five";
import env from "./env.js";

initializeApp(env.firebase);
const db = getFirestore();
const logger = setupLogger();
enableIndexedDbPersistence(db).catch(() => {});
if (env.boardless) {
  setupCommandListener();
} else {
  const board = new five.Board();
  board.on("ready", setupCommandListener);
}


function setupLogger() {
  try {
    const { createLogger, format } = winston;
    const { combine, splat, timestamp, printf } = format;
    const myFormat = printf( ({ level, message, timestamp , ...metadata}) => {
      let msg = `${timestamp} [${level}] : ${message} `;
      if(metadata) {
        msg += JSON.stringify(metadata);
      }
      console.log(timestamp, message);
      console.log(msg);
      return msg;
    });
    return createLogger({
      level: 'info',
      format: combine(
        format.colorize(),
        splat(),
        timestamp(),
        myFormat
      ),
      defaultMeta: { service: 'user-service' },
      transports: [
        // Write all logs with importance level of `error` or less to `error.log`
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        // Write all logs with importance level of `info` or less to `combined.log`
        new winston.transports.File({ filename: 'combined.log' }),
      ],
    });
  } catch(err) {
      console.error(err);
      console.log("Command logger off");
      return {
        info: console.log,
        warn: console.log,
        error: console.error
      }
  }
}

function setupCommandListener() {
  const runCommand = async (command) => {
    const commandData = command.data();
    function turnLight(isOn) {
      if (!env.boardless) {
        const led = new five.Led(13);
        if (isOn) {
          led.on();
        } else {
          led.off();
        }
      }
      addDoc(collection(db, "lightStatus"), {timestamp, isOn});
    }
  
    function moveDoor(isOpen) {
      addDoc(collection(db, "doorStatus"), {timestamp, isOpen});
    }
  
    const timestamp = new Date();
    const commandList = {
      door: {
        open: () => moveDoor(true),
        close: () => moveDoor(false)
      },
      light: {
        turnon: () => turnLight(true),
        turnoff: () => turnLight(false)
      }
    }
    logger.info(`Running command: ${commandData.action} ${commandData.target}`);
    await commandList[commandData.target][commandData.action]();
    return updateDoc(command.ref, { executedAt: new Date() });
  }

  return onSnapshot(collection(db, "commands"), (commandsSnapshot) => commandsSnapshot.docs
    .filter(command => !command.data().ack)
    .sort((a, b) => a.data().requestedAt - b.data().requestedAt)
    .forEach((command) => {
      updateDoc(command.ref, { ack: true });
      runCommand(command);
    }), err => logger.error(err));
}