import { initializeApp } from 'firebase/app';
import { getFirestore, onSnapshot, collection, getDocs, addDoc } from 'firebase/firestore';
import env from "./env.js";

initializeApp(env.firebase);
const db = getFirestore();

const commandsSnapshot = await getDocs(collection(db, "commands"));
let lastCommand = commandsSnapshot.docs.sort(
  (a, b) => a.data().timestamp - b.data().timestamp).pop();

onSnapshot(collection(db, "commands"), async (commandsSnapshot) => {
    const command = commandsSnapshot.docs.sort(
      (a, b) => a.data().timestamp - b.data().timestamp).pop();
    if (command &&  command.id !== lastCommand?.id) {
      const commandData = command.data();
      await runCommand(commandData.target, commandData.action);
      lastCommand = command;
    }
}, err => console.error(err));

async function runCommand(target, action) {
  const timestamp = new Date();
  const turnLight = (isOn) => addDoc(collection(db, "lightStatus"), {timestamp, isOn});
  const moveDoor = (isOpen) => addDoc(collection(db, "doorStatus"), {timestamp, isOpen});

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

  console.log(`Running command: ${action} ${target}`);
  await commands[target][action]();
}

/*
const five = require("johnny-five");
const  board = new five.Board();

board.on("ready", () => {
	const led = new five.Led(13);
	led.blink(500);
});
*/