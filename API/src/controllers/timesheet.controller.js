
import _ from "lodash";
import db from "../../config/sequelize";
import helpers from "../helpers/helper";
import utils from "../services/utils.service";
import moment from "moment";
import e from "express";

const { timesheet, users, projects, sprints, teams, task, task_type, taskStatuses, timesheetDetails } = db;
const Op = db.Sequelize.Op;

const timeSheetController = () => {
	const createTimesheet = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("the comming req obj is :",JSON.stringify(reqObj));

		if (!reqObj.companyId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Company id is required"
			);
		}

		if (!reqObj.userId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"User id is required"
			);
		}
		if (!reqObj.teamId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Team id is required"
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
		if (!reqObj.task_type_id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"task type id is required"
			);
		}
		// if (!reqObj.task_code) {
		// 	return helpers.appresponse(
		// 		res,
		// 		404,
		// 		false,
		// 		null,
		// 		"task code is required"
		// 	);
		// }
		if (!reqObj.title) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"title is required"
			);
		}
		if (!reqObj.story_points) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"story points is required"
			);
		}
		if (!reqObj.estimated_hours) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Estimate hours is required"
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
		if (!reqObj.comments) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Comments is required"
			);
		}
		if (!reqObj.task_status_id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Task status Id is required"
			);
		}



		console.log("create time sheet called", moment(reqObj.timesheet_date).format('YYYY-MM-DD'))

		const user = await users.findOne({
			where: {
				companyId: reqObj.companyId
			}
		})
		////  console.log("Users",user)
		reqObj.createdAt = Date.now();
		reqObj.createdBy = user.id;






		const timesheetDetailsObj = await timesheet.findOne({
			where: {
				timesheet_date: new Date(reqObj.timesheet_date),
				companyId: reqObj.companyId,
				userId: reqObj.userId
			}

		})

		console.log("timesheetDetails data valuee", timesheetDetailsObj)
		if (timesheetDetailsObj == null || timesheetDetailsObj.length == 0) {
			const data = {
				timesheet_date: reqObj.timesheet_date,
				companyId: reqObj.companyId,
				teamId: reqObj.teamId,
				userId: reqObj.userId,
				createdAt: Date.now(),
				createdBy: user.id

			};

			// const taskObj = await task.findOne({
			// 	where: {
			// 		task_code: reqObj.task_code
			// 	}
			// })

			if (reqObj.task_id) {
				const taskObj = await task.findOne({
					where: {
						id: reqObj.task_id
					}
				})

				timesheet
					.create(data)

					.then((teamuserData) => {

						console.log("timesheet created called", teamuserData)


						let detailsData = {
							timesheet_id: teamuserData.id,
							teamId: reqObj.teamId,
							task_type_id: reqObj.task_type_id,
							task_code: taskObj.task_code,
							title: reqObj.title,
							project_id: reqObj.project_id,
							task_id: reqObj.task_id,
							sprint_id: reqObj.sprint_id,
							story_points: reqObj.story_points,
							estimated_hours: reqObj.estimated_hours,
							actual_hours: reqObj.actual_hours,
							comments: reqObj.comments,
							task_status_id: reqObj.task_status_id,
							createdAt: Date.now(),
							createdBy: user.id

						}
						timesheetDetails.create(detailsData).then((timesheetData) => {


							console.log("timesheet data", timesheetData)

							return helpers.appresponse(
								res,
								200,
								true,
								timesheetData,
								" added successfully"
							);



						}).catch((err) => {

							return helpers.appresponse(res, 404, false, null, err.message);
						});

					}).catch((err) => {

						return helpers.appresponse(res, 404, false, null, err.message);
					});

			}
			else {

				let taskDict = {
					companyId: reqObj.companyId,
					task_type_id: reqObj.task_type_id,
					task_code: reqObj.task_code,
					title: reqObj.title,
					project_id: reqObj.project_id,
					sprint_id: reqObj.sprint_id,
					story_points: reqObj.story_points,
					estimated_hours: reqObj.estimated_hours,
					actual_hours: reqObj.actual_hours,
					comments: reqObj.comments,
					task_status_id: reqObj.task_status_id,
					createdAt: Date.now(),
					createdBy: user.id
				}
				task.create(taskDict).then((taskData) => {

					timesheet
						.create(data)

						.then((teamuserData) => {

							console.log("timesheet created called", teamuserData)


							let detailsData = {
								timesheet_id: teamuserData.id,
								teamId: reqObj.teamId,
								task_type_id: reqObj.task_type_id,
								task_code: reqObj.task_code,
								title: reqObj.title,
								project_id: reqObj.project_id,
								task_id: taskData.id,
								sprint_id: reqObj.sprint_id,
								story_points: reqObj.story_points,
								estimated_hours: reqObj.estimated_hours,
								actual_hours: reqObj.actual_hours,
								comments: reqObj.comments,
								task_status_id: reqObj.task_status_id,
								createdAt: Date.now(),
								createdBy: user.id

							}
							timesheetDetails.create(detailsData).then((timesheetData) => {


								console.log("timesheet data", timesheetData)

								return helpers.appresponse(
									res,
									200,
									true,
									timesheetData,
									" added successfully"
								);



							}).catch((err) => {

								return helpers.appresponse(res, 404, false, null, err.message);
							});

						}).catch((err) => {

							return helpers.appresponse(res, 404, false, null, err.message);
						});

				})
			}

			// if (reqObj.task_id && taskObj != null &&taskObj.length != 0) {


			// 	// if(taskObj == null && taskObj.length == 0)
			// 	// {
			// 	// 	return helpers.appresponse(res,
			// 	// 		404,
			// 	// 		false,
			// 	// 		null,
			// 	// 		"Task code is already exits"
			// 	// 	);

			// 	// }
			// 	timesheet
			// 		.create(data)

			// 		.then((teamuserData) => {

			// 			console.log("timesheet created called", teamuserData)


			// 			let detailsData = {
			// 				timesheet_id: teamuserData.id,
			// 				teamId: reqObj.teamId,
			// 				task_type_id: reqObj.task_type_id,
			// 				task_code: reqObj.task_code,
			// 				title: reqObj.title,
			// 				project_id: reqObj.project_id,
			// 				task_id: reqObj.task_id,
			// 				sprint_id: reqObj.sprint_id,
			// 				story_points: reqObj.story_points,
			// 				estimated_hours: reqObj.estimated_hours,
			// 				actual_hours: reqObj.actual_hours,
			// 				comments: reqObj.comments,
			// 				task_status_id: reqObj.task_status_id,
			// 				createdAt: Date.now(),
			// 				createdBy: user.id

			// 			}
			// 			timesheetDetails.create(detailsData).then((timesheetData) => {


			// 				console.log("timesheet data", timesheetData)

			// 				return helpers.appresponse(
			// 					res,
			// 					200,
			// 					true,
			// 					timesheetData,
			// 					" added successfully"
			// 				);



			// 			}).catch((err) => {

			// 				return helpers.appresponse(res, 404, false, null, err.message);
			// 			});

			// 		}).catch((err) => {

			// 			return helpers.appresponse(res, 404, false, null, err.message);
			// 		});

			// 	// })
			// }
			// else {

			// 	if(taskObj != null && taskObj.length != 0)
			// 	{
			// 		return helpers.appresponse(res,
			// 			404,
			// 			false,
			// 			null,
			// 			"Task code already exists"
			// 		);

			// 	}
			// 	let taskDict = {
			// 		companyId: reqObj.companyId,
			// 		task_type_id: reqObj.task_type_id,
			// 		task_code: reqObj.task_code,
			// 		title: reqObj.title,
			// 		project_id: reqObj.project_id,
			// 		sprint_id: reqObj.sprint_id,
			// 		story_points: reqObj.story_points,
			// 		estimated_hours: reqObj.estimated_hours,
			// 		actual_hours: reqObj.actual_hours,
			// 		comments: reqObj.comments,
			// 		task_status_id: reqObj.task_status_id,
			// 		createdAt: Date.now(),
			// 		createdBy: user.id
			// 	}
			// 	task.create(taskDict).then((taskData) => {

			// 		timesheet
			// 			.create(data)

			// 			.then((teamuserData) => {

			// 				console.log("timesheet created called", teamuserData)


			// 				let detailsData = {
			// 					timesheet_id: teamuserData.id,
			// 					teamId: reqObj.teamId,
			// 					task_type_id: reqObj.task_type_id,
			// 					task_code: reqObj.task_code,
			// 					title: reqObj.title,
			// 					project_id: reqObj.project_id,
			// 					task_id: taskData.id,
			// 					sprint_id: reqObj.sprint_id,
			// 					story_points: reqObj.story_points,
			// 					estimated_hours: reqObj.estimated_hours,
			// 					actual_hours: reqObj.actual_hours,
			// 					comments: reqObj.comments,
			// 					task_status_id: reqObj.task_status_id,
			// 					createdAt: Date.now(),
			// 					createdBy: user.id

			// 				}
			// 				timesheetDetails.create(detailsData).then((timesheetData) => {


			// 					console.log("timesheet data", timesheetData)

			// 					return helpers.appresponse(
			// 						res,
			// 						200,
			// 						true,
			// 						timesheetData,
			// 						" added successfully"
			// 					);



			// 				}).catch((err) => {

			// 					return helpers.appresponse(res, 404, false, null, err.message);
			// 				});

			// 			}).catch((err) => {

			// 				return helpers.appresponse(res, 404, false, null, err.message);
			// 			});

			// 	})
			// }


		}
		else {



			// const taskObj = await task.findOne({
			// 	where: {
			// 		task_code: reqObj.task_code
			// 	}
			// })

			if (reqObj.task_id) {

				const taskObj = await task.findOne({
					where: {
						id: reqObj.task_id
					}
				})
				let detailsData = {
					timesheet_id: timesheetDetailsObj.id,
					teamId: reqObj.teamId,
					task_type_id: reqObj.task_type_id,
					task_code: taskObj.task_code,
					title: reqObj.title,
					project_id: reqObj.project_id,
					task_id: reqObj.task_id,
					sprint_id: reqObj.sprint_id,
					story_points: reqObj.story_points,
					estimated_hours: reqObj.estimated_hours,
					actual_hours: reqObj.actual_hours,
					comments: reqObj.comments,
					task_status_id: reqObj.task_status_id,
					createdAt: Date.now(),
					createdBy: user.id

				}
				timesheetDetails.create(detailsData).then((timesheetData) => {


					console.log("timesheet data", timesheetData)

					return helpers.appresponse(
						res,
						200,
						true,
						timesheetData,
						" added successfully"
					);



				}).catch((err) => {

					return helpers.appresponse(res, 404, false, null, err.message);
				});
			}
			else {

				let taskDict = {
					companyId: reqObj.companyId,
					task_type_id: reqObj.task_type_id,
					task_code: reqObj.task_code,
					title: reqObj.title,
					project_id: reqObj.project_id,
					sprint_id: reqObj.sprint_id,
					story_points: reqObj.story_points,
					estimated_hours: reqObj.estimated_hours,
					actual_hours: reqObj.actual_hours,
					comments: reqObj.comments,
					task_status_id: reqObj.task_status_id,
					createdAt: Date.now(),
					createdBy: user.id
				}
				task.create(taskDict).then((taskData) => {

					// timesheet
					// 	.create(data)

					// 	.then((teamuserData) => {

					// 		console.log("timesheet created called", teamuserData)


					let detailsData = {
						timesheet_id: timesheetDetailsObj.id,
						teamId: reqObj.teamId,
						task_type_id: reqObj.task_type_id,
						task_code: reqObj.task_code,
						title: reqObj.title,
						project_id: reqObj.project_id,
						task_id: taskData.id,
						sprint_id: reqObj.sprint_id,
						story_points: reqObj.story_points,
						estimated_hours: reqObj.estimated_hours,
						actual_hours: reqObj.actual_hours,
						comments: reqObj.comments,
						task_status_id: reqObj.task_status_id,
						createdAt: Date.now(),
						createdBy: user.id

					}
					timesheetDetails.create(detailsData).then((timesheetData) => {


						console.log("timesheet data", timesheetData)

						return helpers.appresponse(
							res,
							200,
							true,
							timesheetData,
							" added successfully"
						);



					}).catch((err) => {

						return helpers.appresponse(res, 404, false, null, err.message);
					});

					// }).catch((err) => {

					// 	return helpers.appresponse(res, 404, false, null, err.message);
					// });

				})
			}

			//	console.log("taskobj",taskObj.dataValues.id)
			// if (reqObj.task_id && taskObj != null && taskObj.length != 0) {


			// 	if (taskObj == null && taskObj.length == 0) {
			// 		return helpers.appresponse(res,
			// 			404,
			// 			false,
			// 			null,
			// 			"Task code is already exits"
			// 		);

			// 	}
			// 	// timesheet
			// 	// 	.create(data)

			// 	// 	.then((teamuserData) => {

			// 	// 		console.log("timesheet created called", teamuserData)


			// 	let detailsData = {
			// 		timesheet_id: timesheetDetailsObj.id,
			// 		teamId: reqObj.teamId,
			// 		task_type_id: reqObj.task_type_id,
			// 		task_code: reqObj.task_code,
			// 		title: reqObj.title,
			// 		project_id: reqObj.project_id,
			// 		task_id: reqObj.task_id,
			// 		sprint_id: reqObj.sprint_id,
			// 		story_points: reqObj.story_points,
			// 		estimated_hours: reqObj.estimated_hours,
			// 		actual_hours: reqObj.actual_hours,
			// 		comments: reqObj.comments,
			// 		task_status_id: reqObj.task_status_id,
			// 		createdAt: Date.now(),
			// 		createdBy: user.id

			// 	}
			// 	timesheetDetails.create(detailsData).then((timesheetData) => {


			// 		console.log("timesheet data", timesheetData)

			// 		return helpers.appresponse(
			// 			res,
			// 			200,
			// 			true,
			// 			timesheetData,
			// 			" added successfully"
			// 		);



			// 	}).catch((err) => {

			// 		return helpers.appresponse(res, 404, false, null, err.message);
			// 	});

			// 	// }).catch((err) => {

			// 	// 	return helpers.appresponse(res, 404, false, null, err.message);
			// 	// });

			// 	// })
			// }
			// else {
			// 	if (taskObj != null && taskObj.length != 0) {
			// 		return helpers.appresponse(res,
			// 			404,
			// 			false,
			// 			null,
			// 			"Task code already exists"
			// 		);

			// 	}
			// 	let taskDict = {
			// 		companyId: reqObj.companyId,
			// 		task_type_id: reqObj.task_type_id,
			// 		task_code: reqObj.task_code,
			// 		title: reqObj.title,
			// 		project_id: reqObj.project_id,
			// 		sprint_id: reqObj.sprint_id,
			// 		story_points: reqObj.story_points,
			// 		estimated_hours: reqObj.estimated_hours,
			// 		actual_hours: reqObj.actual_hours,
			// 		comments: reqObj.comments,
			// 		task_status_id: reqObj.task_status_id,
			// 		createdAt: Date.now(),
			// 		createdBy: user.id
			// 	}
			// 	task.create(taskDict).then((taskData) => {

			// 		// timesheet
			// 		// 	.create(data)

			// 		// 	.then((teamuserData) => {

			// 		// 		console.log("timesheet created called", teamuserData)


			// 		let detailsData = {
			// 			timesheet_id: timesheetDetailsObj.id,
			// 			teamId: reqObj.teamId,
			// 			task_type_id: reqObj.task_type_id,
			// 			task_code: reqObj.task_code,
			// 			title: reqObj.title,
			// 			project_id: reqObj.project_id,
			// 			task_id: taskData.id,
			// 			sprint_id: reqObj.sprint_id,
			// 			story_points: reqObj.story_points,
			// 			estimated_hours: reqObj.estimated_hours,
			// 			actual_hours: reqObj.actual_hours,
			// 			comments: reqObj.comments,
			// 			task_status_id: reqObj.task_status_id,
			// 			createdAt: Date.now(),
			// 			createdBy: user.id

			// 		}
			// 		timesheetDetails.create(detailsData).then((timesheetData) => {


			// 			console.log("timesheet data", timesheetData)

			// 			return helpers.appresponse(
			// 				res,
			// 				200,
			// 				true,
			// 				timesheetData,
			// 				" added successfully"
			// 			);



			// 		}).catch((err) => {

			// 			return helpers.appresponse(res, 404, false, null, err.message);
			// 		});

			// 		// }).catch((err) => {

			// 		// 	return helpers.appresponse(res, 404, false, null, err.message);
			// 		// });

			// 	})
			// }
			// let detailsData = {
			// 	timesheet_id: timesheetDetailsObj.id,
			// 	teamId: reqObj.teamId,
			// 	task_type_id: reqObj.task_type_id,
			// 	task_code: reqObj.task_code,
			// 	title: reqObj.title,
			// 	project_id: reqObj.project_id,
			// 	sprint_id: reqObj.sprint_id,
			// 	story_points: reqObj.story_points,
			// 	estimated_hours: reqObj.estimated_hours,
			// 	actual_hours: reqObj.actual_hours,
			// 	comments: reqObj.comments,
			// 	task_status_id: reqObj.task_status_id,
			// 	createdAt: Date.now(),
			// 	createdBy: user.id

			// }
			// timesheetDetails.create(detailsData).then((timesheetData) => {


			// 	console.log("timesheet data", timesheetData)

			// 	return helpers.appresponse(
			// 		res,
			// 		200,
			// 		true,
			// 		timesheetData,
			// 		" added successfully"
			// 	);



			// }).catch((err) => {

			// 	return helpers.appresponse(res, 404, false, null, err.message);
			// });
		}


	}

	const getTimesheetByDateFromDetailsTable = async (req, res) => {

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
		if (!reqObj.userId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"user id is required"
			);
		}
		if (!reqObj.timesheet_date) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Timesheet Date  is required"
			);
		}

		const timesheetObject = await timesheet.findOne({
			where: {
				companyId: reqObj.companyId,
				timesheet_date: new Date(reqObj.timesheet_date),
				userId: reqObj.userId
			}
		})

		console.log("timeshsetobject", timesheetObject)
		if (timesheetObject != null) {
			await timesheetDetails.findAll({

				where: {
					timesheet_id: timesheetObject.dataValues.id
				},
				include: [
					{
						model: projects,
					},
					{
						model: sprints,
					},
					{
						model: task_type,
					},
					{
						model: taskStatuses,
					},
					{
						model: timesheet,
					},
					// {
					// 	model: teams,
					// },
				],
			}).then((Data) => {
				console.log(Data, "Data");
				return helpers.appresponse(
					res,
					200,
					true,
					Data,
					"Listed successfully ."
				);

			})
		}
		else {
			return helpers.appresponse(res, 200, true, [], "No Timesheet found for this date");
		}


	}

	const getTimesheet = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("TeamId", reqObj)
		await timesheet.findAll({
			where: {
				companyId: reqObj.companyId,
				status: false
			}
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
	}

	const getTimesheetByUserId = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("TeamId", reqObj)
		await timesheet.findAll({
			where: {
				companyId: reqObj.companyId,
				userId: reqObj.userId,
				status: false
			},

			include: [
				{
					model: projects,
				},
				{
					model: sprints,
				},
				{
					model: task,
				},
				{
					model: teams,
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
					"Listed successfully ."
				);
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	}
	const getOneTimesheet = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("Request id ", reqObj.id)
		timesheet.findOne({
			where: {
				id: reqObj.id,
				status: false
			},


			include: [
				{
					model: projects,
				},
				{
					model: sprints,
				},
				{
					model: task,
				},
				{
					model: teams,
				},
			],

		})

			.then((teamData) => {
				console.log("teamData", teamData)
				if (teamData) {
					return helpers.appresponse(res,
						200,
						true,
						teamData,
						"success",
					);
				} else {
					return helpers.appresponse(res,
						200,
						true,
						[],
						"No timesheet found for the user " + reqObj.id,
					);
				}
			}).catch((err) => {
				return helpers.appresponse(res,
					404,
					false,
					null,
					err.message
				);
			})

	}
	const deleteTimesheet = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("request id", reqObj.id)
		timesheet.update({
			status: true

		}, {
			where: {
				id: reqObj.id
			}
		}).then((data) => {
			return helpers.appresponse(res,
				200,
				true,
				data,
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



	const getTimesheetByDate = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("TeamId", reqObj)
		await timesheet.findAll({
			where: {
				companyId: reqObj.companyId,
				userId: reqObj.userId,
				status: false,

				timesheet_date: new Date(reqObj.date)
			},

			include: [
				{
					model: projects,
				},
				{
					model: sprints,
				},
				{
					model: task,
				},
				{
					model: teams,
				}, {
					model: task_type,
				},
				{
					model: taskStatuses,
				},


			],

		})
			.then((Data) => {
				console.log(Data, "Data value");


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
	}
	const updateTimesheet = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("request id", reqObj.id)
		const user = await users.findOne({
			where: {
				companyId: reqObj.companyId
			}
		})
		reqObj.updatedAt = Date.now();
		reqObj.updatedBy = user.id;
		timesheet
			.update(reqObj, {
				where: {
					id: reqObj.id,
				},
			}).then((data) => {
				return helpers.appresponse(res,
					200,
					true,
					data,
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

	const getoneattenddancebyidanddate = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("request id is : " + reqObj.id);
		if (!reqObj.date) {
			return helpers.appresponse(res, 200, false, [], "date is required");
		}
		if (!reqObj.id) {
			return helpers.appresponse(res, 200, false, [], "date is required");
		}
		users
			.findAll({
				where: {
					id: reqObj.id,
				},
				attributes: {
					exclude: ["password", "userOtp"],
				},
				include: [
					{
						model: attendances,
						where: {
							dateOfAttendance: reqObj.date,
						},
						required: false,
					},
				],
			})
			.then((userData) => {
				if (userData) {
					return helpers.appresponse(
						res,
						200,
						true,
						userData,
						"success"
					);
				} else {
					return helpers.appresponse(
						res,
						404,
						false,
						[],
						"no user found for the user id " + reqObj.id
					);
				}
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};


	return {
		createTimesheet,
		getTimesheet,
		getOneTimesheet,
		deleteTimesheet,
		updateTimesheet,
		getTimesheetByUserId,
		getTimesheetByDate,
		getTimesheetByDateFromDetailsTable
	};
};

export default timeSheetController();
