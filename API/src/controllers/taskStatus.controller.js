import _ from "lodash";
import db from "../../config/sequelize";
import helpers from "../helpers/helper";
import utils from "../services/utils.service";

const { taskStatuses, users, task } = db;
const Op = db.Sequelize.Op;

const taskStatusController = () => {
	const createTaskStatus = async (req, res) => {
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
				"Task status name is required"
			);
		}

		var taskStatusdata = await taskStatuses.findOne({
			where: {
				name: reqObj.name,
				status: false,
			},
		});
		// console.log('taskStatusdata-->',taskStatusdata)
		if (taskStatusdata && taskStatusdata.name) {
			return helpers.appresponse(
				res,
				404,
				false,
				[],
				"Task Status Name is already exists!"
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

		taskStatuses
			.create(reqObj)

			.then((taskStatusData) => {
				return helpers.appresponse(
					res,
					200,
					true,
					taskStatusData,
					"Task Status added successfully!"
				);
			})

			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const getAllTaskStatus = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		await taskStatuses
			.findAll({
				where: {
					companyId: reqObj.companyId,
					status: false,
				},
			})
			.then((taskStatusData) => {
				console.log("taskStatusData", taskStatusData);
				return helpers.appresponse(
					res,
					200,
					true,
					taskStatusData,
					"Task Status listed successfully ."
				);
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const getOneTaskStatus = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("Request id ", reqObj.id);

		await taskStatuses
			.findOne({
				where: {
					id: reqObj.id,
				},
			})

			.then((taskStatusData) => {
				if (taskStatusData) {
					return helpers.appresponse(
						res,
						200,
						true,
						taskStatusData,
						"success"
					);
				} else {
					return helpers.appresponse(
						res,
						404,
						false,
						[],
						"No task status found"
					);
				}
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const deleteTaskStatus = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		if (!reqObj.id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Task status id is required"
			);
		}

		console.log("request id", reqObj.id);

		taskStatuses
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

	const updateTaskStatus = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		if (!reqObj.id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Task status id is required"
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
				"Task status name is required"
			);
		}

		console.log("request id", reqObj.id);

		let cond = {};
		cond["name"] = reqObj.name;
		cond["status"] = false;
		cond["id"] = {
			$notIn: [reqObj.id],
		};
		var taskStatusData = await taskStatuses.findOne({
			where: cond,
		});
		if (taskStatusData && taskStatusData.name) {
			return helpers.appresponse(
				res,
				404,
				false,
				[],
				"Task status name is already exists!"
			);
		}

		const authHeader = req.headers.authorization;
		let updatedByUserId = await helpers.getUserId(authHeader);
		// console.log("updatedByUserId-->", updatedByUserId);
		if (updatedByUserId && updatedByUserId !== undefined) {
			reqObj.updatedAt = Date.now();
			reqObj.updatedBy = updatedByUserId;
		}

		taskStatuses
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
		createTaskStatus,
		getAllTaskStatus,
		getOneTaskStatus,
		deleteTaskStatus,
		updateTaskStatus,
	};
};

export default taskStatusController();
