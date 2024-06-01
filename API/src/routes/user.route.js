import userCtrl from "../controllers/user.controller";
import helpers from "../helpers/helper"
import express from "express";
import imageuploadcontoller from "../controllers/imageupload.controller";
const router = express.Router();



router
	.post(
		"/create",
		imageuploadcontoller.getupload().single("file"),
		userCtrl.create
	)
	.get(
		"/getbyid/:id",
		helpers.authenticateJWT,
		userCtrl.getbyid
	)
	.post(
		"/getall",
		helpers.authenticateJWT,
		userCtrl.getall
	)
	.post(
		"/update",
		helpers.authenticateJWT,
		imageuploadcontoller.getupload().single("file"),
		userCtrl.updateprofile
	)
	.get(
		"/download/:companyId",
		//helper.authenticateJWT,
		userCtrl.download
	)
	.get(
		"/getTodayBirthday/:todayDate/:companyId",
		helpers.authenticateJWT,
		userCtrl.getTodayBirthday
	)
	.get(
		"/downloadBirthday/:monthDate/:companyId",
		//helpers.authenticateJWT,
		userCtrl.getMonthBirthday
	)
	.post(
		"/sendWishes",
		helpers.authenticateJWT,
		userCtrl.sendWishes
	)
export default router;
