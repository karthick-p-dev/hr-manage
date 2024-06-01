import _ from "lodash";
import db from "../../config/sequelize";
import helpers from "../helpers/helper";
import utils from "../services/utils.service";

const { task_type, users } = db;
const Op = db.Sequelize.Op;

const taskTypeController = () => {
	const createTasktype = async (req, res) => {
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
				"Tasktype name is required"
			);
		}
		if (!reqObj.code) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Tasktype code is required"
			);
		}

		var tasktypedata = await task_type.findOne({
			where: {
				name: reqObj.name,
				status: false,
			},
		});
		// console.log('tasktypedata-->',tasktypedata)
		if (tasktypedata && tasktypedata.name) {
			return helpers.appresponse(
				res,
				404,
				false,
				[],
				"Tasktype name is already exists!"
			);
		}

		var tasktypedata = await task_type.findOne({
			where: {
				code: reqObj.code,
				status: false,
			},
		});
		if (tasktypedata && tasktypedata.code) {
			return helpers.appresponse(
				res,
				404,
				false,
				[],
				"Tasktype code is already exists!"
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

		task_type
			.create(reqObj)

			.then((teamData) => {
				return helpers.appresponse(
					res,
					200,
					true,
					teamData,
					" added successfully"
				);
			})

			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const getTasktype = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		await task_type
			.findAll({
				where: {
					companyId: reqObj.companyId,
					status: false,
				},
			})
			.then((Data) => {
				console.log(Data, "Data");
				return helpers.appresponse(
					res,
					200,
					true,
					Data,
					"Tasktype listed successfully."
				);
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const getOneTasktype = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("Request id ", reqObj.id);
		task_type
			.findOne({
				where: {
					id: reqObj.id,
				},
			})

			.then((tasktypeData) => {
				if (tasktypeData) {
					return helpers.appresponse(
						res,
						200,
						true,
						tasktypeData,
						"success"
					);
				} else {
					return helpers.appresponse(
						res,
						404,
						false,
						[],
						"No Tasktype found"
					);
				}
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const deleteTasktype = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		if (!reqObj.id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Tasktype id is required"
			);
		}

		task_type
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

	const updateTasktype = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("request id", reqObj.id);

		if (!reqObj.id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Tasktype id is required"
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
				"Tasktype name is required"
			);
		}
		if (!reqObj.code) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Tasktype code is required"
			);
		}

		let cond = {};
		cond["name"] = reqObj.name;
		cond["status"] = false;
		cond["id"] = {
			$notIn: [reqObj.id],
		};
		var tasktypeData = await task_type.findOne({
			where: cond,
		});
		if (tasktypeData && tasktypeData.name) {
			return helpers.appresponse(
				res,
				404,
				false,
				[],
				"Tasktype name is already exists!"
			);
		}

		// Find already created Tasktype with given Code
		let cond1 = {};
		cond1["code"] = reqObj.code;
		cond1["status"] = false;
		cond1["id"] = {
			$notIn: [reqObj.id],
		};
		var tasktypeData = await task_type.findOne({
			where: cond1,
		});
		// console.log('projectdata-->',projectdata)
		if (tasktypeData && tasktypeData.code) {
			return helpers.appresponse(
				res,
				404,
				false,
				[],
				"Tasktype code is already exists!"
			);
		}

		const authHeader = req.headers.authorization;
		let updatedByUserId = await helpers.getUserId(authHeader);
		if (updatedByUserId && updatedByUserId !== undefined) {
			reqObj.updatedAt = Date.now();
			reqObj.updatedBy = updatedByUserId;
		}

		task_type
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

	const updateActiveStatus = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("reqObj", reqObj);
		task_type
			.update(
				{
					isActive: reqObj.isActive,
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
	
	const listActiveTask = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		await task_type
			.findAll({
				where: {
					companyId: reqObj.companyId,
					isActive: true,
					status: false,
				},
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

	const listallActiveStatus = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		await task_type
			.findAll({
				where: {
					companyId: reqObj.companyId,
					status: false,
				},
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

	return {
		createTasktype,
		getTasktype,
		getOneTasktype,
		deleteTasktype,
		updateTasktype,
		updateActiveStatus,
		listActiveTask,
		listallActiveStatus,
	};
};

export default taskTypeController();
