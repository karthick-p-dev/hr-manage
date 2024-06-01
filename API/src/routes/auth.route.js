import express from "express";
import authCtrl from "../controllers/auth.controller";
import helper from "../helpers/helper";

const router = express.Router();


router
.post(
	"/login",
	authCtrl.login
)
.post(
	"/forgetpassword",
	authCtrl.forgetpassword
)
.post(
	"/verifyotp",
	authCtrl.verifyotp
)

export default router;
