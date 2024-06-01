import helper from "../helpers/helper";
import express from "express";
import attenddanceCtrl from "../controllers/attendance.controller";
const router = express.Router();

router
	.post("/addattendance", helper.authenticateJWT, attenddanceCtrl.addnew)

	.get("/checktime", helper.authenticateJWT, attenddanceCtrl.checktime)
	.get(
		"/getallattenddancebyid/:id",
		helper.authenticateJWT,
		attenddanceCtrl.getallattenddancebyid
	)
	.get(
		"/getallattenddancebyidanddate/:id/:date",
		helper.authenticateJWT,
		attenddanceCtrl.getoneattenddancebyidanddate
	)
	.get(
		"/gettodayattendance/:date/:companyId",
		helper.authenticateJWT,
		attenddanceCtrl.getAttenddanceByToday
	)
	.get(
		"/resqueTime/:id/:dateofAttendance",
		helper.authenticateJWT,
		attenddanceCtrl.resqueTime
	)

	.get(
		"/download/:date/:companyId",
		//helper.authenticateJWT,
		attenddanceCtrl.download
	)
	.get(
		"/downloadAttendance/:startDate/:endDate/:companyId",
		attenddanceCtrl.downloadAttendanceBetweenTwoDate
	)
	.post(
		"/resqueTime", 
		helper.authenticateJWT, 
		attenddanceCtrl.resqueTime)

	.post(
		"/attendanceSearch",
		helper.authenticateJWT,
		attenddanceCtrl.attendanceSearch
	)
	.post(
		"/attendanceSummaryBetweenDate",
		helper.authenticateJWT,
		attenddanceCtrl.getAttendanceBetweenTwoDate
	)
	.post(
		"/singleUserBetweenDates",
		helper.authenticateJWT,
		attenddanceCtrl.getSingleUserAttendanceBetweenDates
	)

	.post(
		"/attendanceManualEntry",
		helper.authenticateJWT,
		attenddanceCtrl.attendanceManualEntry
	)

	.get(
		"/getOverallTotalHrs/:date/:companyId",
		helper.authenticateJWT,
		attenddanceCtrl.getOverallTotalHrsForUser
	)
	.post(
		"/getWeeklyHours",
		helper.authenticateJWT,
		attenddanceCtrl.getHoursBasedOnDate
	);
export default router;
