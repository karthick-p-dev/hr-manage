import timeSheetController from "../controllers/timesheet.controller";
import express from "express";
import helpers from "../helpers/helper";
const router = express.Router();

router
	.post(
		"/createtimesheet",
		helpers.authenticateJWT,
		timeSheetController.createTimesheet
	)
    .get(
        "/listtimesheet/:companyId/:teamId",
		helpers.authenticateJWT,
        timeSheetController.getTimesheet
    )
	.get(
        "/listtimesheetByUser/:companyId/:userId",
		helpers.authenticateJWT,
        timeSheetController.getTimesheetByUserId
    )
	.get(
		"/listtimesheetByDate/:companyId/:userId/:date",
		helpers.authenticateJWT,
        timeSheetController.getTimesheetByDate
		
	)
	.post(
		"/getTimesheetByDate",
		helpers.authenticateJWT,
		timeSheetController.getTimesheetByDateFromDetailsTable
	)
	.get(
		"/getbyid/:id",
		helpers.authenticateJWT,
		timeSheetController.getOneTimesheet
	)
	.post(
		"/deletetimesheet",
		helpers.authenticateJWT,
		timeSheetController.deleteTimesheet
	)
	.post(
		"/updatetimesheet",
		helpers.authenticateJWT,
		timeSheetController.updateTimesheet
	)
	

export default router;
