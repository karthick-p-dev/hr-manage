import taskController from "../controllers/task.controller";
import express from "express";
import helpers from "../helpers/helper";
const router = express.Router();

router
	.post(
		"/createtask",
		//helpers.authenticateJWT,
		taskController.createTask
	)
    .get(
        "/listtask/:companyId",
		helpers.authenticateJWT,
        taskController.getTask
    )
	.post(
		"/listtaskBasedOnProject",
		helpers.authenticateJWT,
        taskController.getTaskBasedOnProjectId
	)
	.get(
		"/getbyid/:id",
		helpers.authenticateJWT,
		taskController.getOneTask
	)
	.post(
		"/deletetask",
		helpers.authenticateJWT,
		taskController.deleteTask
	)
	.post(
		"/updatetask",
		helpers.authenticateJWT,
		taskController.updateTask
	)
	

export default router;
