import _ from "lodash";
import db from "../../config/sequelize";
import helpers from "../helpers/helper";


const { roles } = db;
const Op = db.Sequelize.Op;

const RolesController = () => {
	const create = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		if (!reqObj.roleName) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"roleName is required"
			);
		}
		reqObj.createdAt = Date.now();
		reqObj.updateddAt = Date.now();
		var rolesdata = await roles.findOne({
			where: {
				roleName: reqObj.roleName
			},
		})
		if (rolesdata && rolesdata.roleName) {
			return helpers.appresponse(res,
				404,
				false,
				[],
				"Role name is already in exist"
			);
		}
		roles.create(reqObj).then((roleData) => {
			console.log("userData is to beeee" + roleData.id)
			return helpers.appresponse(res,
				200,
				true,
				roleData,
				"user added successfully"
			);
		}).catch((err) => {
			return helpers.appresponse(res,
				404,
				false,
				null,
				err.message
			);
		});
	};

	const initialcreate = async (req, res) => {
		roles.bulkCreate([
			{
				roleName: 'superadmin',
				createdAt: Date.now(),
				updateddAt: Date.now()
			},
			{
				roleName: 'admin',
				createdAt: Date.now(),
				updateddAt: Date.now()
			},
			{
				roleName: 'employees',
				createdAt: Date.now(),
				updateddAt: Date.now()
			}
		]).then(() => {
			return roles.findAll();
		}).then(roles => {
			console.log(roles)
		}).catch((err) => {
			return helpers.appresponse(res,
				404,
				false,
				null,
				err.message

			);

		})
	};
	const getall = async (req, res) => {
		roles.findAll().then((allroleData) => {
			return helpers.appresponse(res,
				200,
				true,
				allroleData,
				"success",
			);
		}).catch((err) => {
			return helpers.appresponse(res,
				404,
				false,
				null,
				err.message
			);
		})
	};

	const getRolesWithoutSuperAdmin = async(req, res) =>{
		const reqObj = helpers.getReqValues(req);
		roles.findAll().then((allroleData) => {

			const rolesData = allroleData.filter(function(x) { return x.id !== 1; });
	
			return helpers.appresponse(res,
				200,
				true,
				rolesData,
				"success",
			);
		}).catch((err) => {
			return helpers.appresponse(res,
				404,
				false,
				null,
				err.message
			);
		})
	}

	const getOneRole = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("Request id ", reqObj.id);
		roles
			.findOne({
				where: {
					id: reqObj.id,
				},
			})

			.then((teamData) => {
				console.log("teamData", teamData);
				if (teamData) {
					return helpers.appresponse(
						res,
						200,
						true,
						teamData,
						"success"
					);
				} else {
					return helpers.appresponse(
						res,
						404,
						false,
						[],
						"No Roles found."
					);
				}
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const updateRole = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("request id", reqObj.id);

		if (!reqObj.id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Role id is required"
			);
		}
	
	

		roles.update(reqObj, {
			where: {
				id: reqObj.id,
			},
		})
			.then((data) => {
				return helpers.appresponse(
					res,
					200,
					true,
					[],
					"Updated successfully"
				);
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};
	return {
		create,
		getall,
		initialcreate,
		getOneRole,
		updateRole,
		getRolesWithoutSuperAdmin
	};
};

export default RolesController();
