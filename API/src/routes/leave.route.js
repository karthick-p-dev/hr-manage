import leaveCtrl from "../controllers/leave.controller";
import express from "express";
import helpers from "../helpers/helper";
import uils from "../helpers/utils"

const router = express.Router();


router
	.post(
		"/create",
		helpers.authenticateJWT,
		leaveCtrl.create
	)
	.get(
		"/getleave/list/:id",
		helpers.authenticateJWT,
		leaveCtrl.getallLeave
	)
	.post(
		"/approveRequest",
		helpers.authenticateJWT,
		leaveCtrl.approveRequest
	)
	.get(
		"/getbyid/:id",
		helpers.authenticateJWT,
		leaveCtrl.getbyid
	)
	.get(
		"/waiting/:companyId",
		helpers.authenticateJWT,
		leaveCtrl.getWaitingLeave
	)
	.get(
		"/download/:fromDate/:toDate/:companyId",
		//helper.authenticateJWT,
		leaveCtrl.download
	)
	.get(
		"/download/:companyId",
		//helper.authenticateJWT,
		leaveCtrl.download
	)
	.post(
		"/deleteLeave",
		helpers.authenticateJWT,
		leaveCtrl.deleteLeave
	)
	.get(
		"/getallleavebydate/:date/:companyId",
		helpers.authenticateJWT,
		leaveCtrl.getallLeavebydate
	)
	.get(
		"/getallLeavebyFromdateAndToDate/:fromDate/:toDate/:companyId",
		helpers.authenticateJWT,
		leaveCtrl.getallLeavebyFromdateAndToDate
	)
	.post(
		"/getallLeaveBySearch",
		helpers.authenticateJWT,
		leaveCtrl.getAllLeaveBySearch
	)

export default router;
