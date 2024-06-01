import projectsController from "../controllers/project.controller";
import express from "express";
import helpers from "../helpers/helper";

const router = express.Router();

router
	.post(
		"/createproject",
		helpers.authenticateJWT,
		projectsController.createProjects
	)
    .get(
        "/listproject/:companyId",
        helpers.authenticateJWT,
        projectsController.getProjects
    )
	.get(
        "/searchprojects/:companyId/:search",
        //helpers.authenticateJWT,
        projectsController.getProjectsBySearch
    )
	
	.get(
		"/getbyid/:id",
        helpers.authenticateJWT,
		projectsController.getOneProjects
	)
	.post(
		"/deleteproject",
        helpers.authenticateJWT,
		projectsController.deleteProjects
	)
	.post(
		"/updateproject",
        helpers.authenticateJWT,
		projectsController.updateProjects
	)
	

export default router;

