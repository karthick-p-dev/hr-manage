import _ from "lodash";
import db from "../../config/sequelize";
import helpers from "../helpers/helper";
import utils from "../services/utils.service";

const { projects, users } = db;
const Op = db.Sequelize.Op;

const projectsController = () => {
	const createProjects = async (req, res) => {
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
		if (!reqObj.teamleaderId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Teamleader id is required"
			);
		}
		if (!reqObj.managerId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Manager id is required"
			);
		}
		if (!reqObj.name) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Project Name is required"
			);
		}
		if (!reqObj.code) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Project Code is required"
			);
		}
		if (!reqObj.start_date) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Start Date is required"
			);
		}
		if (!reqObj.end_date) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"End Date is required"
			);
		}

		// Find already created Project with given Name
		var projectdata = await projects.findOne({
			where: {
				name: reqObj.name,
			},
		});
		// console.log('projectdata-->',projectdata)
		if (projectdata && projectdata.name) {
			return helpers.appresponse(
				res,
				404,
				false,
				[],
				"Project Name is already exists!"
			);
		}

		// Find already created Project with given Code
		var projectdata = await projects.findOne({
			where: {
				code: reqObj.code,
			},
		});
		// console.log('projectdata-->',projectdata)
		if (projectdata && projectdata.code) {
			return helpers.appresponse(
				res,
				404,
				false,
				[],
				"Project Code is already exists!"
			);
		}

		const authHeader = req.headers.authorization;
		// console.log("authHeader--->", authHeader);
		let createdByUserId = await helpers.getUserId(authHeader);
		console.log("createdByUserId-->", createdByUserId);
		if (createdByUserId && createdByUserId !== undefined) {
			reqObj.createdAt = Date.now();
			reqObj.createdBy = createdByUserId;
		}

		projects
			.create(reqObj)

			.then((teamData) => {
				return helpers.appresponse(
					res,
					200,
					true,
					teamData,
					"Project added successfully!"
				);
			})

			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const getProjects = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		await projects
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
					"Projects listed successfully."
				);
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const getProjectsBySearch = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log(JSON.stringify(reqObj));
		if (!reqObj.companyId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Company id is required."
			);
		}
		if (!reqObj.search) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Search keyword is required."
			);
		}

		await projects
			.findAll({
				where: {
					companyId: reqObj.companyId,
					status: false,
					$or: [
						{
							name: {
								[Op.substring]: reqObj.search,
							},
						},
						{
							code: {
								[Op.substring]: reqObj.search,
							},
						},
					],
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
					"Projects listed successfully."
				);
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};
	const getOneProjects = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("Request id ", reqObj.id);
		projects
			.findOne({
				where: {
					id: reqObj.id,
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
						"No Project found."
					);
				}
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const deleteProjects = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("request id", reqObj.id);

		if (!reqObj.id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Project Id is required"
			);
		}

		projects
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
				return helpers.appresponse(res, 200, true, [], "success");
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const updateProjects = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		if (!reqObj.id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Project Id is required"
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
				"Project Name is required"
			);
		}
		if (!reqObj.code) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Project Code is required"
			);
		}
		if (!reqObj.start_date) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Start Date is required"
			);
		}
		if (!reqObj.end_date) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"End Date is required"
			);
		}

		// Find already created Project with given Name
		let cond = {};
		cond["name"] = reqObj.name;
		cond["id"] = {
			$notIn: [reqObj.id],
		};
		var projectdata = await projects.findOne({
			where: cond,
		});
		// console.log('projectdata-->',projectdata)
		if (projectdata && projectdata.name) {
			return helpers.appresponse(
				res,
				404,
				false,
				[],
				"Project Name is already exists!"
			);
		}

		// Find already created Project with given Code
		let cond1 = {};
		cond1["code"] = reqObj.code;
		cond1["id"] = {
			$notIn: [reqObj.id],
		};
		var projectdata = await projects.findOne({
			where: cond1,
		});
		// console.log('projectdata-->',projectdata)
		if (projectdata && projectdata.code) {
			return helpers.appresponse(
				res,
				404,
				false,
				[],
				"Project Code is already exists!"
			);
		}

		const authHeader = req.headers.authorization;
		let updatedByUserId = await helpers.getUserId(authHeader);
		// console.log("updatedByUserId-->", updatedByUserId);
		if (updatedByUserId && updatedByUserId !== undefined) {
			reqObj.updatedAt = Date.now();
			reqObj.updatedBy = updatedByUserId;
		}

		console.log("request id", reqObj.id);

		projects
			.update(reqObj, {
				where: {
					id: reqObj.id,
				},
			})
			.then((data) => {
				return helpers.appresponse(res, 200, true, [], "success");
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	return {
		createProjects,
		getProjects,
		getOneProjects,
		deleteProjects,
		updateProjects,
		getProjectsBySearch,
	};
};

export default projectsController();
