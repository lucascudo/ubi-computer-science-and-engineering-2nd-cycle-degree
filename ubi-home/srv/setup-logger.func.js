import winston from 'winston';

export default function setupLogger() {
	try {
		const { createLogger, format } = winston;
		const { combine, splat, timestamp, printf } = format;
		const myFormat = printf( ({ level, message, timestamp , ...metadata}) => {
			let msg = `${timestamp} [${level}] : ${message} `;
			if(metadata) {
				msg += JSON.stringify(metadata);
			}
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