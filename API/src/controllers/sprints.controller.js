import _ from "lodash";
import db from "../../config/sequelize";
import helpers from "../helpers/helper";
import utils from "../services/utils.service";

const { sprints, users, projects } = db;
const Op = db.Sequelize.Op;

const sprintsController = () => {
	const createSprints = async (req, res) => {
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
		if (!reqObj.project_id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Project id is required"
			);
		}
		if (!reqObj.sprint_name) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Sprint name is required"
			);
		}
		if (!reqObj.code) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Sprint code is required"
			);
		}
		if (!reqObj.start_dates) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Start date is required"
			);
		}
		if (!reqObj.end_date) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"End date is required"
			);
		}

		// Find already created Sprint with given Name
		var sprintdata = await sprints.findOne({
			where: {
				sprint_name: reqObj.sprint_name,
				status: false,
			},
		});
		// console.log("sprintdata-->", sprintdata);
		// if (sprintdata && sprintdata.sprint_name) {
		// 	return helpers.appresponse(
		// 		res,
		// 		404,
		// 		false,
		// 		[],
		// 		"Sprint Name is already exists!"
		// 	);
		// }

		// Find already created Sprint with given Code
		var sprintdata = await sprints.findOne({
			where: {
				code: reqObj.code,
				status: false,
			},
		});
		// console.log("sprintdata-->", sprintdata);
		if (sprintdata && sprintdata.code) {
			return helpers.appresponse(
				res,
				404,
				false,
				[],
				"Sprint Code is already exists!"
			);
		}

		const authHeader = req.headers.authorization;
		let createdByUserId = await helpers.getUserId(authHeader);
		console.log("createdByUserId-->", createdByUserId);
		if (createdByUserId && createdByUserId !== undefined) {
			reqObj.createdAt = Date.now();
			reqObj.createdBy = createdByUserId;
		}

		sprints
			.create(reqObj)

			.then((teamData) => {
				return helpers.appresponse(
					res,
					200,
					true,
					teamData,
					"Sprint added successfully."
					);
			})

			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const getSprints = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		await sprints
			.findAll({
				where: {
					companyId: reqObj.companyId,
					status: false,
				},
				include: [projects],
			})
			.then((Data) => {
				console.log(Data, "Data");
				return helpers.appresponse(
					res,
					200,
					true,
					Data,
					"Listed successfully ."
				);
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const getSprintSearch = async (req, res) => {

		const reqObj = helpers.getReqValues(req);


		if (!reqObj.companyId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Company id is required"
			);
		}

		if (!reqObj.searchKey) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Search key is required"
			);
		}
		await sprints
			.findAll({
				where: {
					companyId: reqObj.companyId,
					status: false,
					$or: [
						{
							sprint_name:
							{
								[Op.substring]: reqObj.searchKey

							}
						},
						{
							code:
							{
								[Op.substring]: reqObj.searchKey

							}
						},
					],
				
				},
				include: [projects],
			})
			.then((Data) => {
				console.log(Data, "Data");
				return helpers.appresponse(
					res,
					200,
					true,
					Data,
					"Projects listed successfully."
				);
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	}

	const getSprintsByProjectId = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		await sprints
			.findAll({
				where: {
					companyId: reqObj.companyId,
					project_id: reqObj.projectId,
					status: false,
				},
				include: [{ model: projects }],
			})
			.then((Data) => {
				console.log(Data, "Data");
				return helpers.appresponse(
					res,
					200,
					true,
					Data,
					"Listed successfully ."
				);
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};
	const getOneSprints = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("Request id ", reqObj.id);
		sprints
			.findOne({
				where: {
					id: reqObj.id,
					status: false,
				},
				include: [projects],
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
						faslse,
						[],
						"No sprint found for the user " + reqObj.id
					);
				}
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};
	const deleteSprints = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		if (!reqObj.id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Sprint id is required"
			);
		}
		console.log("request id", reqObj.id);

		sprints
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
				return helpers.appresponse(res, 200, true, data, "success");
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const updateSprints = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("request id", reqObj.id);

		if (!reqObj.id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Sprint id is required"
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
		if (!reqObj.project_id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Project id is required"
			);
		}
		if (!reqObj.sprint_name) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Sprint name is required"
			);
		}
		if (!reqObj.code) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Sprint code is required"
			);
		}
		if (!reqObj.start_dates) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Start date is required"
			);
		}
		if (!reqObj.end_date) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"End date is required"
			);
		}

		let cond = {};
		cond["sprint_name"] = reqObj.sprint_name;
		cond["status"] = false;
		cond["id"] = {
			$notIn: [reqObj.id],
		};
		var sprintdata = await sprints.findOne({
			where: cond,
		});
		// console.log("sprintdata-->", sprintdata);
		// if (sprintdata && sprintdata.sprint_name) {
		// 	return helpers.appresponse(
		// 		res,
		// 		404,
		// 		false,
		// 		[],
		// 		"Sprint name is already exists!"
		// 	);
		// }

		let cond1 = {};
		cond1["code"] = reqObj.code;
		cond1["status"] = false;
		cond1["id"] = {
			$notIn: [reqObj.id],
		};
		var sprintdata = await sprints.findOne({
			where: cond1,
		});
		// console.log("sprintdata-->", sprintdata);
		if (sprintdata && sprintdata.code) {
			return helpers.appresponse(
				res,
				404,
				false,
				[],
				"Sprint code is already exists!"
			);
		}

		const authHeader = req.headers.authorization;
		let updatedByUserId = await helpers.getUserId(authHeader);
		if (updatedByUserId && updatedByUserId !== undefined) {
			reqObj.updatedAt = Date.now();
			reqObj.updatedBy = updatedByUserId;
		}

		sprints
			.update(reqObj, {
				where: {
					id: reqObj.id,
				},
			})
			.then((data) => {
				return helpers.appresponse(res, 200, true, [], "Updated successfully.");
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	return {
		createSprints,
		getSprints,
		getOneSprints,
		getSprintsByProjectId,
		deleteSprints,
		updateSprints,
		getSprintSearch,
	};
};

export default sprintsController();
