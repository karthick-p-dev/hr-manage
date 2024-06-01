import projectUserController from "../controllers//projectUsers.controller";
import express from "express";
import helpers from "../helpers/helper";
const router = express.Router();

router
	.post(
		"/createprojectuser",
		helpers.authenticateJWT,
		projectUserController.createProjectUser
	)
    .get(
        "/listprojectuser/:companyId/:projectId",
		helpers.authenticateJWT,
        projectUserController.getProjectUser
       
    )
	.get(
        "/getProjectId/:companyId/:userId",
		helpers.authenticateJWT,
        projectUserController.getProjectId
    )
	.get(
		"/getbyid/:id",
		helpers.authenticateJWT,
        projectUserController.getOneProjectUser

	)
	.get(
		"/getprojectforuserid/:userId/:companyId",
    		 helpers.authenticateJWT,
	   projectUserController.getprojectforuserid
	)
	.post(
		"/deleteprojectuser",
		helpers.authenticateJWT,
        projectUserController.deleteProjectUser
	
	)
	.post(
		"/updateprojectuser",
		helpers.authenticateJWT,
        projectUserController.updateProjectUser
	
	)
	.post(
		"/updateposition",
		helpers.authenticateJWT,
        projectUserController.positionUpdate
	
	)
	
	.post(
		"/checkMyPosition",
		helpers.authenticateJWT,
		projectUserController.checkMyUserIdInTopPosition
	)
	.get(
        "/getProjectUserBasedOnId/:companyId/:userId",
		helpers.authenticateJWT,
        projectUserController.getProjectUsersBasedOnId
      
    )
	.post(
		"/removefromProject",
		helpers.authenticateJWT,
        projectUserController.removeFromProject

	)

export default router;
