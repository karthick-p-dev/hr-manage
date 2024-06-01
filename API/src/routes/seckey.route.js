
import seckeyctrl from "../controllers/secretkey.controller";
import express from "express";
import helpers from "../helpers/helper"
const router = express.Router();


router
.post(
	"/getseckey",
	helpers.authenticateJWT,
	seckeyctrl.getseckey
)



export default router;

