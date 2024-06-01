import teamController from "../controllers/teams.controller";
import express from "express";
import helpers from "../helpers/helper";
const router = express.Router();

router
	.post(
		"/createteam",
		helpers.authenticateJWT,
		teamController.createTeam
	)
    .get(
        "/listteam/:companyId",
		helpers.authenticateJWT,
        teamController.getTeam
    )
	.get(
		"/getbyid/:id",
		helpers.authenticateJWT,
		teamController.getOneTeam
	)
	.post(
		"/deleteteam",
		helpers.authenticateJWT,
		teamController.deleteTeam
	)
	.post(
		"/updateteam",
		helpers.authenticateJWT,
		teamController.updateTeam
	)
	

export default router;
