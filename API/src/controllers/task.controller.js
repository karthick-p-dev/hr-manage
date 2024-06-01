import _ from "lodash";
import db from "../../config/sequelize";
import helpers from "../helpers/helper";
import utils from "../services/utils.service";

const { task, users, task_type, taskStatuses, projects, sprints } = db;
const Op = db.Sequelize.Op;

const taskController = () => {
	const createTask = async (req, res) => {
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
		if (!reqObj.task_type_id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Task type id is required"
			);
		}
		if (!reqObj.task_code) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Task code is required"
			);
		}
		if (!reqObj.title) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Task title is required"
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
		if (!reqObj.story_points) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Task story points is required"
			);
		}
		if (!reqObj.estimated_hours) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Estimated hours is required"
			);
		}
		if (!reqObj.actual_hours) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Actual hours is required"
			);
		}
		if (!reqObj.task_status_id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Task status id is required"
			);
		}

		var taskdata = await task.findOne({
			where: {
				title: reqObj.title,
				status: false,
			},
		});
		// console.log('taskdata-->',taskdata)
		if (taskdata && taskdata.title) {
			return helpers.appresponse(
				res,
				404,
				false,
				[],
				"Task title is already exists!"
			);
		}

		var taskdata = await task.findOne({
			where: {
				task_code: reqObj.task_code,
				status: false,
			},
		});
		if (taskdata && taskdata.task_code) {
			return helpers.appresponse(
				res,
				404,
				false,
				[],
				"Task code is already exists!"
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

		const taskType = await task_type.findOne({
			id: reqObj.companyId,
		});
		console.log("task_type_id", taskType);

		task.create(reqObj)

			.then((taskData) => {
				return helpers.appresponse(
					res,
					200,
					true,
					taskData,
					"Task added successfully"
				);
			})

			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const getTask = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		await task
			.findAll({
				where: {
					companyId: reqObj.companyId,
					status: false,
				},
				include: [task_type, taskStatuses, projects, sprints],
			})
			.then((Data) => {
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

	const getOneTask = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("Request id ", reqObj.id);
		task.findOne({
			where: {
				id: reqObj.id,
			},
			include: [task_type, taskStatuses, projects, sprints],
		})

			.then((taskData) => {
				console.log("taskData", JSON.stringify(taskData.sprint));
				if (taskData) {
					return helpers.appresponse(
						res,
						200,
						true,
						taskData,
						"success"
					);
				} else {
					return helpers.appresponse(
						res,
						404,
						false,
						[],
						"No task found."
					);
				}
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const getTaskBasedOnProjectId = (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log(JSON.stringify(reqObj));

		if (!reqObj.companyId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Company id is required"
			);
		}
		if (!reqObj.projectId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Project id is required"
			);
		}
		var cond = {};
		cond.companyId = reqObj.companyId;
		cond.status = false;
		cond.project_id = reqObj.projectId;

		if (reqObj.sprintId) {
			cond.sprint_id = reqObj.sprintId;
		}

		console.log("Request id ", reqObj.id);
		task.findAll({
			where: cond,
			include: [task_type, taskStatuses, projects, sprints],
		})

			.then((taskData) => {
				console.log("taskData", taskData);
				if (taskData) {
					return helpers.appresponse(
						res,
						200,
						true,
						taskData,
						"success"
					);
				} else {
					return helpers.appresponse(
						res,
						404,
						false,
						[],
						"No task found."
					);
				}
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const deleteTask = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		if (!reqObj.id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Task id is required"
			);
		}
		console.log("request id", reqObj.id);

		task.update(
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

	const updateTask = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("request id", reqObj.id);

		if (!reqObj.id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Task id is required"
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
		if (!reqObj.task_type_id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Task type id is required"
			);
		}
		if (!reqObj.task_code) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Task code is required"
			);
		}
		if (!reqObj.title) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Task title is required"
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
		if (!reqObj.story_points) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Task story points is required"
			);
		}
		if (!reqObj.estimated_hours) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Estimated hours is required"
			);
		}
		if (!reqObj.actual_hours) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Actual hours is required"
			);
		}
		if (!reqObj.task_status_id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Task status id is required"
			);
		}

		let cond = {};
		cond["title"] = reqObj.title;
		cond["status"] = false;
		cond["id"] = {
			$notIn: [reqObj.id],
		};
		var taskdata = await task.findOne({
			where: cond,
		});
		if (taskdata && taskdata.title) {
			return helpers.appresponse(
				res,
				404,
				false,
				[],
				"Task title is already exists!"
			);
		}

		// Find already created Project with given Code
		let cond1 = {};
		cond1["task_code"] = reqObj.task_code;
		cond1["status"] = false;
		cond1["id"] = {
			$notIn: [reqObj.id],
		};
		var taskdata = await task.findOne({
			where: cond1,
		});
		if (taskdata && taskdata.task_code) {
			return helpers.appresponse(
				res,
				404,
				false,
				[],
				"Task code is already exists!"
			);
		}

		const authHeader = req.headers.authorization;
		let updatedByUserId = await helpers.getUserId(authHeader);
		// console.log("updatedByUserId-->", updatedByUserId);
		if (updatedByUserId && updatedByUserId !== undefined) {
			reqObj.updatedAt = Date.now();
			reqObj.updatedBy = updatedByUserId;
		}

		task.update(reqObj, {
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
		createTask,
		getTask,
		getOneTask,
		deleteTask,
		updateTask,
		getTaskBasedOnProjectId,
	};
};

export default taskController();
