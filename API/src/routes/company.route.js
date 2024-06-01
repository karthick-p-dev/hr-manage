import companyCtrl from "../controllers/company.controller";
import helpers from "../helpers/helper";
import express from "express";
const router = express.Router();


router
	.post(
		"/create",
		helpers.authenticateJWT,
		companyCtrl.create
	)
	.get(
		"/getcompany",
		helpers.authenticateJWT,
		companyCtrl.getall
	)
	.get(
		"/getcompanybyemail/:email",
		helpers.authenticateJWT,
		companyCtrl.getcompanybymail
	)
	.post(
		"/update",
		helpers.authenticateJWT,
		companyCtrl.update
	)




export default router;
