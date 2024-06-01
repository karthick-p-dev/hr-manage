import sprintsController from "../controllers/sprints.controller";
import express from "express";
import helpers from "../helpers/helper";
const router = express.Router();

router
	.post(
		"/createsprints",
		helpers.authenticateJWT,
		sprintsController.createSprints
	)
    .get(
        "/listsprints/:companyId",
		helpers.authenticateJWT,
        sprintsController.getSprints
    )
	.get(
        "/listsprintsByProjectId/:companyId/:projectId",
		helpers.authenticateJWT,
        sprintsController.getSprintsByProjectId
	)
	.get(
		"/getSprintSearch/:companyId/:searchKey",
		helpers.authenticateJWT,
        sprintsController.getSprintSearch
	)
	.get(
		"/getbyid/:id",
		helpers.authenticateJWT,
		sprintsController.getOneSprints
	)
	.post(
		"/deletesprints",
		helpers.authenticateJWT,
		sprintsController.deleteSprints
	)
	.post(
		"/updatesprints",
		helpers.authenticateJWT,
		sprintsController.updateSprints
	)
	

export default router;
