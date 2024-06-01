import holidayCtrl from "../controllers/holiday.controller";
import express from "express";
import helpers from "../helpers/helper";

const router = express.Router();


router
	.post(
		"/create",
		helpers.authenticateJWT,
		holidayCtrl.create
	)
	.post(
		"/delete",
		helpers.authenticateJWT,
		holidayCtrl.remeove
	)
	.post(
		"/update",
		helpers.authenticateJWT,
		holidayCtrl.update
	)
	.get(
		"/getall/:companyId",
		helpers.authenticateJWT,
		holidayCtrl.viewall
	)
	.get(
		"/getone/:id/:companyId",
		helpers.authenticateJWT,
		holidayCtrl.getone
	)
export default router;
