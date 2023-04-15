export default class Home {

	constructor(env, db, logger, firestore, notificator, five) {
		this.env = env;
		this.db = db;
		this.logger = logger;
		this.firestore = firestore;
		this.notificator = notificator;
		this.five = five;
	}

	env;
	db;
	firestore;
	notificator;
	logger;
	five;
	board;
	led;
	sw;
	motor;
	motion;
	thermometer;
	photoresistor;

	setup() {
		const start = () => {
			this.setupCommandListener();
			this.notificator.push("Your domestic server is online.");
		}

		if (this.env.boardless) {
			this.logger.warn("Boardless mode enabled, skipping board configuration");
			start();
		} else {
			this.logger.info("Configuring board");
			this.board = new this.five.Board();
			this.board.on("ready", () => {
				this.setupBoardPins();
				start();
			}).on("error", (err) => {
				const errorMessage = "Couldn't connect to the Board. Configure it properly using Arduino IDE or enable boardless mode by changing your env.js file";
				this.logger.error(errorMessage);
				throw err;
			});
		}
	}
		
	setupBoardPins() {
		const repl = {};
		this.logger.info("Configuring board pins");
		if (this.env.pins.led) {
			this.logger.info(`Configuring LED at port ${this.env.pins.led}`);
			this.led = new this.five.Led(this.env.pins.led);
		}
		if (this.env.pins.motor) {
			this.logger.info(`Configuring door motor at port ${this.env.pins.motor}`);
			this.motor = new this.five.Motor({ pin: this.env.pins.motor });
			repl.motor = this.motor;
		}
		if (this.env.pins.switch) {
			this.logger.info(`Configuring door reed switch at port ${this.env.pins.switch}`);
			this.setupReedSwitch(this.env.pins.switch);
		}
		if (this.env.pins.motion) {
			this.logger.info(`Configuring IR Motion at port ${this.env.pins.motion}`);
			this.setupIRMotion(this.env.pins.motion);
		}
		if (this.env.pins.photoresistor && this.env.photoresistorFrequency) {
			this.logger.info(`Configuring ${this.env.photoresistorFrequency} Hz photoresistor at port ${this.env.pins.photoresistor}`);
			repl.pot = this.setupPhotoResistor(this.env.pins.photoresistor, this.env.photoresistorFrequency);
		}
		if (this.env.pins.thermometer && this.env.thermometerDriver) {
			this.logger.info(`Configuring thermometer ${this.env.thermometerDriver} at port ${this.env.pins.thermometer}`);
			this.setupThermometer(this.env.pins.thermometer, this.env.thermometerDriver);
		}
		// Inject hardware into the Repl instance's context;
		// allows direct command line access
		this.board.repl.inject(repl);
	}
		
	setupCommandListener() {
		const errorHandler = (err) => {
			this.logger.error("Couldn't connect to Firestore database. Configure your Firebase keys properly at env.js");
			throw err;
		}
		const commandList = {
			door: {
				close: () => this.motor && this.motor.start()
			},
			light: {
				turnon: () => this.toggleLed(true),
				turnoff: () => this.toggleLed(false)
			}
		}
		const commandsIterator = (commandsSnapshot) => commandsSnapshot.docs
				.filter((command) => !command.data().ack)
				.sort((a, b) => a.data().requestedAt - b.data().requestedAt)
				.forEach(async (command) => {
					const {action, target} = command.data();
					this.firestore.updateDoc(command.ref, { ack: true });
					if (commandList[target][action]) {
						this.logger.info(`Running command: ${action} ${target}`);
						await commandList[target][action]();
						return this.firestore.updateDoc(command.ref, { executedAt: new Date() });
					}
					return this.logger.warn(`Unknown command: ${action} ${target}`);
				});

		this.logger.info("Configuring command listener");
		this.firestore.onSnapshot(this.firestore.collection(this.db, "commands"), commandsIterator, errorHandler);
	}

	setupPhotoResistor(pin, freq) {
		this.photoresistor = new this.five.Sensor({
			pin,
			freq
		});
		setInterval(() => {
			const value = this.photoresistor.value;
			this.logger.info(`Luminosity: ${value}`);
			this.firestore.addDoc(this.firestore.collection(this.db, "luxStatus"), {
				timestamp: new Date(),
				value
			});
		}, this.env.refreshInterval);
		return this.photoresistor;
	}
	
	setupReedSwitch(pin) {
		let lastDoorStatus;
		this.sw = new this.five.Switch(pin);
		const updateDoorStatus = (isOpen) => {
			if (isOpen === lastDoorStatus) {
				return;
			}
			lastDoorStatus = isOpen;
			if (isOpen) {
				this.notificator.push("Your front door is open.");
			} else {
				this.motor && this.motor.stop();
			}
			this.logger.info(`The door is ${isOpen ? "open" : "closed"}`);
			this.firestore.addDoc(this.firestore.collection(this.db, "doorStatus"), {
				timestamp: new Date(),
				isOpen
			});
		}
		this.sw.on("open", () => updateDoorStatus(true));
		this.sw.on("close", () => () => updateDoorStatus(false));
		return this.sw;
	}

	setupIRMotion(pin) {
		let lastMotionStatus;
		const updateMotionStatus = (inMotion) => {
			if (lastMotionStatus === inMotion) {
				return;
			}
			lastMotionStatus = inMotion;
			this.toggleLed(inMotion);
			this.logger.info(`Motion ${ inMotion ? "started" : "ended" }`);
			inMotion && this.notificator.push("Motion detected in your house!");
			this.firestore.addDoc(this.firestore.collection(this.db, "motionStatus"), {
				timestamp: new Date(),
				inMotion
			});
		}
		this.motion = new this.five.IR.Motion(pin);
		this.motion.on("calibrated", () => this.logger.info("IR Motion calibrated"));
		this.motion.on("motionstart", () => updateMotionStatus(true));
		this.motion.on("motionend", () => updateMotionStatus(false));
		return this.motion;
	}

	setupThermometer(pin, controller) {
		this.thermometer = new this.five.Thermometer({
			controller,
			pin
		});
		setInterval(() => {
			const value = this.thermometer.celsius;
			if (value > this.env.maxTemp) {
				this.notificator.push("Your house is on fire!");
				this.led && this.led.blink();
			} else {
				this.led && this.led.stop();
			}
			this.logger.info(`Temperature: ${value}`);
			this.firestore.addDoc(this.firestore.collection(this.db, "tempStatus"), {
				timestamp: new Date(),
				value
			});
		}, this.env.refreshInterval);
		return this.thermometer;
	}

	toggleLed(isOn) {
		this.led && this.led[isOn ? "on" : "off"]();
		this.firestore.addDoc(this.firestore.collection(this.db, "lightStatus"), {
			timestamp: new Date(),
			isOn
		});
	}
}
