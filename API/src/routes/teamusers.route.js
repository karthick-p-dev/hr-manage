import teamUserController from "../controllers/teamusers.controller";
import express from "express";
import helpers from "../helpers/helper";
const router = express.Router();

router
	.post(
		"/createteamuser",
		helpers.authenticateJWT,
		teamUserController.createTeamUser
	)
    .get(
        "/listteamuser/:companyId/:teamId",
		helpers.authenticateJWT,
        teamUserController.getTeamUser
    )
	.get(
        "/getTeamId/:companyId/:userId",
		helpers.authenticateJWT,
        teamUserController.getTeamId
    )
	.get(
		"/getbyid/:id",
		helpers.authenticateJWT,
		teamUserController.getOneTeamUser
	)
	.post(
		"/deleteteamuser",
		helpers.authenticateJWT,
		teamUserController.deleteTeamUser
	)
	.post(
		"/updateteamuser",
		helpers.authenticateJWT,
		teamUserController.updateTeamUser
	)
	.post(
		"/updateposition",
		helpers.authenticateJWT,
		teamUserController.positionUpdate
	)
	.post(
		"/getEmployeeByPosition",
		helpers.authenticateJWT,
		teamUserController.getEmployeeBasedOnPosition
	)
	.post(
		"/checkMyPosition",
		helpers.authenticateJWT,
		teamUserController.checkMyUserIdInTopPosition
	)
	.get(
        "/getTeamUserBasedOnId/:companyId/:userId",
		helpers.authenticateJWT,
        teamUserController.getTeamUsersBasedOnId
    )
	.post(
		"/removefromTeam",
		helpers.authenticateJWT,
		teamUserController.removeFromTeam
	)

export default router;
