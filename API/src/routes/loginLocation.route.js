import loginLocationController from "../controllers/loginLocation.controller";
import express from "express";
import helpers from "../helpers/helper";
const router = express.Router();

router
	.post(
		"/createLocation",
		helpers.authenticateJWT,
		loginLocationController.create
	)
    .get(
        "/getActiveLocation/:userId",
        helpers.authenticateJWT,
        loginLocationController.getActiveLocation
    )


export default router;
