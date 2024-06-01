import _ from "lodash";
import db from "../../config/sequelize";
import helpers from "../helpers/helper";
import utils from "../services/utils.service";

const { teams, users } = db;
const Op = db.Sequelize.Op;

const teamsController = () => {
	const createTeam = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("reqObj", reqObj);

		if (!reqObj.companyId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Company id is required"
			);
		}
		if (!reqObj.name) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Team name is required"
			);
		}
		if (!reqObj.code) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Team code is required"
			);
		}

		if (!reqObj.teamLeaderId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Team leader id is required"
			);
		}
		if (!reqObj.teamManagerId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Team manager id is required"
			);
		}
		var teamdata = await teams.findOne({
			where: {
				name: reqObj.name,
				status: false,
			},
		});
		if (teamdata && teamdata.name) {
			return helpers.appresponse(
				res,
				404,
				false,
				[],
				"Team name is already exists!"
			);
		}

		// Find already created Team with given Code
		var teamdata = await teams.findOne({
			where: {
				code: reqObj.code,
				status: false,
			},
		});
		// console.log('teamdata-->',teamdata)
		if (teamdata && teamdata.code) {
			return helpers.appresponse(
				res,
				404,
				false,
				[],
				"Team code is already exists!"
			);
		}

		const authHeader = req.headers.authorization;
		let createdByUserId = await helpers.getUserId(authHeader);
		// console.log("createdByUserId-->", createdByUserId);
		if (createdByUserId && createdByUserId !== undefined) {
			reqObj.createdAt = Date.now();
			reqObj.createdBy = createdByUserId;
		}

		teams
			.create(reqObj)

			.then((teamData) => {
				return helpers.appresponse(
					res,
					200,
					true,
					teamData,
					"Team added successfully!"
				);
			})

			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const getTeam = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		await teams
			.findAll({
				where: {
					companyId: reqObj.companyId,
					status: false,
				},
				include: [
					{
						model: users,
						as: "teamleader",
					},
					{
						model: users,
						as: "manager",
					},
				],
			})
			.then((Data) => {
				console.log(Data, "Data");
				return helpers.appresponse(
					res,
					200,
					true,
					Data,
					"Teams Listed successfully ."
				);
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const getOneTeam = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("Request id ", reqObj.id);
		teams
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
						"Team listed successfully."
					);
				} else {
					return helpers.appresponse(
						res,
						404,
						false,
						[],
						"No teams found."
					);
				}
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const deleteTeam = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		if (!reqObj.id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Team id is required"
			);
		}
		console.log("request id", reqObj.id);

		teams
			.update(
				{
					status: true,
				},
				{
					where: {
						id: reqObj.id,
					},
				}
			)
			.then((data) => {
				return helpers.appresponse(
					res,
					200,
					true,
					[],
					"Deleted successfully"
				);
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const updateTeam = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("request id", reqObj.id);

		if (!reqObj.id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Team id is required"
			);
		}
		if (!reqObj.companyId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Company id is required"
			);
		}
		if (!reqObj.name) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Team name is required"
			);
		}
		if (!reqObj.code) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Team code is required"
			);
		}
		if (!reqObj.teamLeaderId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Team leader id is required"
			);
		}
		if (!reqObj.teamManagerId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Team manager id is required"
			);
		}

		let cond = {};
		cond["name"] = reqObj.name;
		cond["status"] = false;
		cond["id"] = {
			$notIn: [reqObj.id],
		};
		var teamdata = await teams.findOne({
			where: cond,
		});
		if (teamdata && teamdata.name) {
			return helpers.appresponse(
				res,
				404,
				false,
				[],
				"Team Name is already exists!"
			);
		}

		// Find already created Project with given Code
		let cond1 = {};
		cond1["code"] = reqObj.code;
		cond1["status"] = false;
		cond1["id"] = {
			$notIn: [reqObj.id],
		};
		var teamdata = await teams.findOne({
			where: cond1,
		});
		if (teamdata && teamdata.code) {
			return helpers.appresponse(
				res,
				404,
				false,
				[],
				"Team code is already exists!"
			);
		}

		const authHeader = req.headers.authorization;
		let updatedByUserId = await helpers.getUserId(authHeader);
		// console.log("updatedByUserId-->", updatedByUserId);
		if (updatedByUserId && updatedByUserId !== undefined) {
			reqObj.updatedAt = Date.now();
			reqObj.updatedBy = updatedByUserId;
		}

		teams
			.update(reqObj, {
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
		createTeam,
		getTeam,
		getOneTeam,
		deleteTeam,
		updateTeam,
	};
};

export default teamsController();
