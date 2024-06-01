import informationController from "../controllers/information.controller";
import imageuploadcontoller from "../controllers/imageupload.controller";
import express from "express";
import helpers from "../helpers/helper"
const router = express.Router();


router
.post(
	"/infocontent",
	helpers.authenticateJWT,
	imageuploadcontoller.getupload().single("file"),
	informationController.informationcontent
)
.post(
	"/deleteinfo",
	helpers.authenticateJWT,
	informationController.deleteInformation
)
.get(
	"/getinfo/:companyId",
	helpers.authenticateJWT,
	informationController.getInformation
)





export default router;