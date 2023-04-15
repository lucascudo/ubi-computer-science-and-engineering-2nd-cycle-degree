import {
  onSnapshot,
  collection,
  addDoc,
  updateDoc
} from 'firebase/firestore';

export default class Home {

	constructor(env, db, notificator, logger, five) {
		this.env = env;
		this.db = db;
		this.logger = logger;
    this.notificator = notificator;
		this.five = five;
	}

	env;
	db;
  notificator;
	logger;
	five;
	board;
	led;
	sw;
	motor;
	thermometer;
	photoresistor;

	setup() {
		if (this.env.boardless) {
			this.setupCommandListener();
		} else {
			this.board = new this.five.Board();
			this.board.on("ready", () => {
				this.led = new this.five.Led(this.env.pins.led);
				this.sw = new this.five.Switch(this.env.pins.switch);
				this.motor = new this.five.Motor({
					pin: this.env.pins.motor
				});
				this.photoresistor = new this.five.Sensor({
					pin: this.env.pins.photoresistor,
					freq: 250
				});
				this.thermometer = new this.five.Thermometer({
					controller: this.env.thermometerDriver,
					pin: this.env.pins.thermometer
				});
				// Inject the `motor` and `photoresistor` hardware into
				// the Repl instance's context;
				// allows direct command line access
				this.board.repl.inject({
					pot: this.photoresistor,
					motor: this.motor,
				});
				this.setupBoardListeners();
				this.setupCommandListener();
			});
		}
    return this.notificator.push("Your domestic server is online.");
	}
		
	setupBoardListeners() {
		const timestamp = new Date();
		const updateDoorStatus = (isOpen) => {
			this.doorStatus = (isOpen) ? "open" : "closed";
			this.logger.info(`The door is ${this.doorStatus}`);
			addDoc(collection(this.db, "doorStatus"), {timestamp, isOpen});
		}
		this.sw.on("open", () => {
      updateDoorStatus(true);
      this.notificator.push("Your front door is open.");
    });
		this.sw.on("close", () => () => {
			this.motor.stop();
			updateDoorStatus(false);
		});
	
		setInterval(() => {
			const temp = this.thermometer.celsius;
			const lux = this.photoresistor.value;
      if (temp > 50) {
        this.notificator.push("Your house is on fire!");
      }
			this.logger.info(`Temperature: ${temp}`);
			addDoc(collection(this.db, "tempStatus"), {timestamp, temp});
			this.logger.info(`Luminosity: ${lux}`);
			addDoc(collection(this.db, "luxStatus"), {timestamp, lux});
		}, this.env.refreshInterval);
	}
		
	setupCommandListener() {
		const runCommand = async (command) => {
			const timestamp = new Date();
			const {action, target} = command.data();
			const commandList = {
				door: {
					close: () => !this.env.boardless && this.motor.start()
				},
				light: {
					turnon: () =>  {
						!this.env.boardless && this.led.on();
						addDoc(collection(this.db, "lightStatus"), {
							timestamp,
							isOn: true
						});
					},
					turnoff: () => {
						!this.env.boardless && this.led.off();
						addDoc(collection(this.db, "lightStatus"), {
							timestamp,
							isOn: false
						});
					}
				}
			}
		
			if (commandList[target][action]) {
        this.logger.info(`Running command: ${action} ${target}`);
				await commandList[target][action]();
				return updateDoc(command.ref, { executedAt: new Date() });
			}
      return this.logger.warn(`Unknown command: ${action} ${target}`);
		}
	
		onSnapshot(collection(this.db, "commands"), (commandsSnapshot) => {
			commandsSnapshot.docs
				.filter((command) => !command.data().ack)
				.sort((a, b) => a.data().requestedAt - b.data().requestedAt)
				.forEach((command) => updateDoc(command.ref, { ack: true }) && runCommand(command));
		}, err => this.logger.error(err));
	}
}