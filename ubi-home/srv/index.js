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
  board.on("ready", () => {
    const led = new five.Led(env.pins.led);
    const sw = new five.Switch(env.pins.switch);
    const motor = new five.Motor({
      pin: env.pins.motor
    });
    const photoresistor = new five.Sensor({
      pin: "A2",
      freq: 250
    });
    const thermometer = new five.Thermometer({
      controller: "LM35",
      pin: env.pins.thermometer
    });
    // Inject the `motor` and`sensor` hardware into
    // the Repl instance's context;
    // allows direct command line access
    board.repl.inject({
      pot: photoresistor,
      motor,
    });
    setupBoardListeners();
    setupCommandListener();
  });
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

function setupBoardListeners () {
  const timestamp = new Date();
  const updateDoorStatus = (isOpen) => {
    const doorStatus = (isOpen) ? "open" : "closed";
    logger.info(`The door is ${doorStatus}`);
    addDoc(collection(db, "doorStatus"), {timestamp, isOpen});
  };

  sw.on("open", () => updateDoorStatus(true));
  sw.on("close", () => () => {
    motor.stop();
    updateDoorStatus(false);
  });
  thermometer.on("change", () =>  {
    const value = thermometer.celcius;
    logger.info(`Temperature changed to: ${value}`);  
    addDoc(collection(db, "tempStatus"), {timestamp, value});
  });
  photoresistor.on("data", function () {
    const {value} = this;
    logger.info(`Luminosity changed to: ${value}`);  
    addDoc(collection(db, "luxStatus"), {timestamp, value});
  });
}

function setupCommandListener() {
  const runCommand = async (command) => {
    const timestamp = new Date();
    const commandData = command.data();
    const turnLight = (isOn) => {
      if (!env.boardless) {
        if (isOn) {
          led.on();
        } else {
          led.off();
        }
      }
      addDoc(collection(db, "lightStatus"), {timestamp, isOn});
    };
    const commandList = {
      door: {
        close: motor.start
      },
      light: {
        turnon: () => turnLight(true),
        turnoff: () => turnLight(false)
      }
    }
  
    logger.info(`Running command: ${commandData.action} ${commandData.target}`);
    await commandList[commandData.target][commandData.action]();
    return updateDoc(command.ref, { executedAt: new Date() });
  };

  return onSnapshot(collection(db, "commands"), (commandsSnapshot) => commandsSnapshot.docs
    .filter(command => !command.data().ack)
    .sort((a, b) => a.data().requestedAt - b.data().requestedAt)
    .forEach((command) => {
      updateDoc(command.ref, { ack: true });
      runCommand(command);
    }), err => logger.error(err));
}