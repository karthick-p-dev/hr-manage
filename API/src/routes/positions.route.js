import positionController from "../controllers/positions.controller";
import express from "express";
import helpers from "../helpers/helper";
const router = express.Router();

router
	.post(
		"/createPosition",
		helpers.authenticateJWT,
		positionController.createPosition
	)
	.get(
		"/listPositions/:companyId",
		helpers.authenticateJWT,
		positionController.getAllPositions
	)
	.get(
		"/getPosition/:id",
		helpers.authenticateJWT,
		positionController.getOnePosition
	)
	.post(
		"/deletePosition",
		helpers.authenticateJWT,
		positionController.deletePosition
	)
	.post(
		"/updatePosition",
		helpers.authenticateJWT,
		positionController.updatePosition
	)
	.get(
		"/getTopPositions/:companyId/:userId",
		helpers.authenticateJWT,
		positionController.getPositionBasedOnTopPosition
	);

export default router;
