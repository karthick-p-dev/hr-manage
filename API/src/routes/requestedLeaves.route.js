import requestedCtrl from '../controllers/requestedLeaves.controller'
import express from "express";
import helpers from "../helpers/helper"
const router = express.Router();


router
.get(
	"/getbyid/:id",
	helpers.authenticateJWT,
	requestedCtrl.getById
)
.get(
	"/getbyidRequestedLeaves/:id",
	helpers.authenticateJWT,
	requestedCtrl.getByIdRequestLeaves
)
.get(
	"/getbyidLeaves/:id",
	helpers.authenticateJWT,
	requestedCtrl.getByIdLeaves
)
.get(
	"/getAllApprovedLeaves/:companyId",
	helpers.authenticateJWT,
	requestedCtrl.getAllApprovedLeaves
)



export default router;

