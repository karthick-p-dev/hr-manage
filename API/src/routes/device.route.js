import deviceController from "../controllers/newDevice.controller";
import express from "express";
import helpers from "../helpers/helper";
const router = express.Router();

router
	.post(
		"/deviceCreate",
		//helpers.authenticateJWT,
		deviceController.deviceCreate
	)
	.get(
		"/getDevice/:companyId",
		helpers.authenticateJWT,
		deviceController.getdevice
	)
	.post(
		"/approveDevice",
		helpers.authenticateJWT,
		deviceController.approveDevice
	);

export default router;
