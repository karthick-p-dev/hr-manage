import helper from "../helpers/helper"
import express from "express";
import faceCntrl from "../controllers/userFace.controller";
const router = express.Router();


router
	.post(
		"/addFace",
		faceCntrl.create

	)


	.get(
		"/getallface",
		faceCntrl.getAllFaces

	)
	.get(
		"/getnamebyid/:id",
		faceCntrl.getname

	)



export default router;
