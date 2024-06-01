import tasktypeController from "../controllers/tasktype.controller";
import express from "express";
import helpers from "../helpers/helper";
const router = express.Router();

router
	.post(
		"/createtasktype",
		//helpers.authenticateJWT,
		tasktypeController.createTasktype
	)
    .get(
        "/listtasktype/:companyId",
		helpers.authenticateJWT,
        tasktypeController.getTasktype
    )
	.get(
		"/getbyid/:id",
		helpers.authenticateJWT,
		tasktypeController.getOneTasktype
	)
	.post(
		"/deletetasktype",
		helpers.authenticateJWT,
		tasktypeController.deleteTasktype
	)
	.post(
		"/updatetasktype",
		helpers.authenticateJWT,
		tasktypeController.updateTasktype
	)
	.post(
		"/updatetaskactive",
		helpers.authenticateJWT,
		tasktypeController.updateActiveStatus
	)
	.get(
		"/listactivetask/:companyId",
		helpers.authenticateJWT,
		tasktypeController.listActiveTask
	)
	.get(
		"/listallactivetask/:companyId",
		helpers.authenticateJWT,
		tasktypeController.listallActiveStatus
	)
	

export default router;
