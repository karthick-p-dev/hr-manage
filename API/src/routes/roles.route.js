
import rolesCtrl from "../controllers/role.contoller";
import express from "express";
import helpers from "../helpers/helper"
const router = express.Router();


router
.post(
	"/create",
	helpers.authenticateJWT,
	rolesCtrl.create
)
.get(
	"/getall",
	helpers.authenticateJWT,
	rolesCtrl.getall
)
.get(
	"/getbyid/:id",
	helpers.authenticateJWT,
	rolesCtrl.getOneRole
)
.post(
	"/update",
	helpers.authenticateJWT,
	rolesCtrl.updateRole
)
.get(
	"/getRoles",
	helpers.authenticateJWT,
	rolesCtrl.getRolesWithoutSuperAdmin
)


export default router;

