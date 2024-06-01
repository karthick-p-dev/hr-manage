import { loggers } from "winston";
import config from "./config/config";
import app from "./config/express";

// import db from "./config/sequelize";
// import socketHelper from './src/helpers/socketHelper';
// import sharedCtrl from './src/controllers/shared.controller';
// import chatChangeStatus from './src/services/chatChangeStatus.cron';

// Get default logger
const logger = loggers.get(config.loggerName); // eslint-disable-line no-global-assign

// make bluebird default Promise
Promise = require("bluebird"); // eslint-disable-line no-global-assign

if (!module.parent) {
	app.listen(config.port, async () => {
		logger.info(
			`The application has started on port ${config.port} (${config.env})`
		); // eslint-disable-line no-console
	});
}

// chatChangeStatus();

export default app;
