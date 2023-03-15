import { initializeApp } from 'firebase/app';
import { getFirestore, onSnapshot, collection, getDocs, addDoc } from 'firebase/firestore';
import env from "./env.js";
import winston from 'winston';

initializeApp(env.firebase);
const db = getFirestore();
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

/*
const five = require("johnny-five");
const  board = new five.Board();

board.on("ready", () => {
*/
  const commandsSnapshot = await getDocs(collection(db, "commands"));
  let lastCommand = commandsSnapshot.docs.sort(
    (a, b) => a.data().timestamp - b.data().timestamp).pop();

  onSnapshot(collection(db, "commands"), async (commandsSnapshot) => {
      const command = commandsSnapshot.docs.sort(
        (a, b) => a.data().timestamp - b.data().timestamp).pop();
      if (command &&  command.id !== lastCommand?.id) {
        const commandData = command.data();
        lastCommand = command;
        await runCommand(commandData.target, commandData.action);
      }
  }, err => logger.error(err));

  async function runCommand(target, action) {
    function turnLight(isOn) {
      /*
      const led = new five.Led(13);
      if (isOn) {
        led.on();
      } else {
        led.off();
      }
      */
      addDoc(collection(db, "lightStatus"), {timestamp, isOn});
    }

    function moveDoor(isOpen) {
      addDoc(collection(db, "doorStatus"), {timestamp, isOpen});
    }

    const timestamp = new Date();
    const commands = {
      door: {
        open: () => moveDoor(true),
        close: () => moveDoor(false)
      },
      light: {
        turnon: () => turnLight(true),
        turnoff: () => turnLight(false)
      }
    }
    logger.info(`Running command: ${action} ${target}`);
    await commands[target][action]();
  }
/*
});
*/