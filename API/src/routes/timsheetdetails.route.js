
import timesheetDetailsCtrl from "../controllers/timesheetDetails.controller"
import helpers from "../helpers/helper"
import express from "express";

const router = express.Router();



router
.post(
		"/update",
		helpers.authenticateJWT,
		timesheetDetailsCtrl.updateTimesheetDetails

	)
    .get(
		"/getbyid/:id",
		helpers.authenticateJWT,
		timesheetDetailsCtrl.getOneTimeSheetDetails
	)
	
export default router;
