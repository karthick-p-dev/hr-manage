import taskController from "../controllers/taskStatus.controller";
import express from "express";
import helpers from "../helpers/helper";
const router = express.Router();

router
	.post(
		"/createTaskStatus",
		//helpers.authenticateJWT,
		taskController.createTaskStatus
	)
    .get(
        "/listAllTaskStatus/:companyId",
		helpers.authenticateJWT,
        taskController.getAllTaskStatus
    )
	.get(
		"/getbyid/:id",
		helpers.authenticateJWT,
		taskController.getOneTaskStatus
	)
	.post(
		"/deleteTaskStatus",
		helpers.authenticateJWT,
		taskController.deleteTaskStatus
	)
	.post(
		"/updateTaskStatus",
		helpers.authenticateJWT,
		taskController.updateTaskStatus
	)
	

export default router;
