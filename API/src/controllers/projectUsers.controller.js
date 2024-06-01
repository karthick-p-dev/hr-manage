import _ from "lodash";
import db from "../../config/sequelize";
import helpers from "../helpers/helper";
import utils from "../services/utils.service";

const { users, teamusers, positions, teams ,projectUsers,projects, companies, roles} = db;
const Op = db.Sequelize.Op;

const projectUsersController = () => {
	const createProjectUser = async (req, res) => {
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
				"User id is required"
			);
		}
		if (!reqObj.projectId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"ProjectId id is required"
			);
		}
		// if (!reqObj.position_id) {
		// 	return helpers.appresponse(
		// 		res,
		// 		404,
		// 		false,
		// 		null,
		// 		"Position id is required"
		// 	);
		// }

		const projectUsersData = await projectUsers.findOne({
			where: {
				userId: reqObj.userId,
				isActive: true,
			},
		});
		console.log("teamusersData-->", projectUsersData);

		console.log("reqObj.teamId", reqObj.teamId);
		//console.log("teamusersData.teamId", teamusersData.teamId);

		if (
			projectUsersData &&
			projectUsersData.userId &&
			projectUsersData.projectId === reqObj.projectId
		) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"User already assigned to this Project."
			);
		} else if (
			projectUsersData &&
			projectUsersData.userId &&
			projectUsersData.projectId !== reqObj.projectId
		) {
			const authHeader = req.headers.authorization;
			let createdByUserId = await helpers.getUserId(authHeader);
			// console.log("createdByUserId-->", createdByUserId);
			if (createdByUserId && createdByUserId !== undefined) {
				reqObj.createdAt = Date.now();
				reqObj.createdBy = createdByUserId;
			}

			

			projectUsers
				.create(reqObj)
				.then((projectUserData) => {
					return helpers.appresponse(
						res,
						200,
						true,
						projectUserData,
						"Project user added successfully"
					);
				})
				.catch((err) => {
					return helpers.appresponse(
						res,
						404,
						false,
						null,
						err.message
					);
				});
		
		} else {
			const authHeader = req.headers.authorization;
			let createdByUserId = await helpers.getUserId(authHeader);
			// console.log("createdByUserId-->", createdByUserId);
			if (createdByUserId && createdByUserId !== undefined) {
				reqObj.createdAt = Date.now();
				reqObj.createdBy = createdByUserId;
			}

			// await users
			// 	.update(
			// 		{
			// 			deviceId: "",
			// 			token: "",
			// 		},
			// 		{
			// 			where: {
			// 				id: reqObj.userId,
			// 			},
			// 		}
			// 	)
			// 	.then((data) => {});

			projectUsers
				.create(reqObj)

				.then((teamuserData) => {
					return helpers.appresponse(
						res,
						200,
						true,
						teamuserData,
						"Project user added successfully"
					);
				})
				.catch((err) => {
					return helpers.appresponse(
						res,
						404,
						false,
						null,
						err.message
					);
				});
		}
	};

	const getProjectId = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("companyId-->", reqObj.companyId);
		console.log("teamId-->", reqObj.userId);
		await projectUsers
			.findAll({
				where: {
					companyId: reqObj.companyId,
					userId: reqObj.userId,
					isActive: true,
					status: false,
				},
				include: [users, projects],
			})

			.then((projectuserData) => {
				// console.log(Data, "Data");
				return helpers.appresponse(
					res,
					200,
					true,
					projectuserData,
					"Projectusers listed successfully."
				);
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	// const getEmployeeBasedOnPosition = async (req, res) => {
	// 	const reqObj = helpers.getReqValues(req);

	// 	if (!reqObj.companyId) {
	// 		return helpers.appresponse(
	// 			res,
	// 			404,
	// 			false,
	// 			null,
	// 			"Company id is required"
	// 		);
	// 	}
	// 	if (!reqObj.position_id) {
	// 		return helpers.appresponse(
	// 			res,
	// 			404,
	// 			false,
	// 			null,
	// 			"position id is required"
	// 		);
	// 	}
	// 	await teamusers
	// 		.findAll({
	// 			where: {
	// 				companyId: reqObj.companyId,
	// 				position_id: reqObj.position_id,
	// 				isActive: true,
	// 				status: false,
	// 			},
	// 			include: [users, positions, teams],
	// 		})

	// 		.then((teamuserData) => {
	// 			// console.log(Data, "Data");
	// 			return helpers.appresponse(
	// 				res,
	// 				200,
	// 				true,
	// 				teamuserData,
	// 				"Teamusers listed successfully."
	// 			);
	// 		})
	// 		.catch((err) => {
	// 			return helpers.appresponse(res, 404, false, null, err.message);
	// 		});
	// };

	const checkMyUserIdInTopPosition = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		if (!reqObj.userId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Project user id is required"
			);
		}
		if (!reqObj.companyId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"company id is required"
			);
		}

		await teamusers
			.findAll({
				where: {
					companyId: reqObj.companyId,
					userId: reqObj.userId,
					isActive: true,
					status: false,
				},
				include: [users, teams],
			})

			.then(async (teamuserData) => {
				let teamUser = [];

				for await (const obj of teamuserData) {
					console.log("objjj", obj.position.topPosition);
					if (obj.position.topPosition == true) {
						teamUser.push(obj);
					}
				}

				console.log(teamUser, "teamuserData");
				return helpers.appresponse(
					res,
					200,
					true,
					teamUser,
					"Teamusers listed successfully."
				);
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};
	const positionUpdate = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		if (!reqObj.id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Team user id is required"
			);
		}
		// if (!reqObj.position_id) {
		// 	return helpers.appresponse(
		// 		res,
		// 		404,
		// 		false,
		// 		null,
		// 		"Position id is required"
		// 	);
		// }

		//console.log("companyId-->", reqObj.companyId);
		//console.log("teamId-->", reqObj.teamId);

		// teamusers
		// 	.findOne({
		// 		where: {
		// 			id: reqObj.id,
		// 		},
		// 	})
		// 	.then(async (teamData) => {
		// 		console.log("teamData", teamData);
		// 		await users
		// 			.update(
		// 				{
		// 					deviceId: "",
		// 					token: "",
		// 				},
		// 				{
		// 					where: {
		// 						id: teamData.userId,
		// 					},
		// 				}
		// 			)
		// 			.then((data) => {
		// 				console.log("users updated");
		// 			});
		// 	});
		await projectUsers
			.update(reqObj, {
				where: {
					id: reqObj.id,
				},
			})
			.then(async (data) => {
				console.log("dattt", data);
				// await users
				// .update(
				// 	{
				// 		deviceId: "",
				// 		token: "",
				// 	},
				// 	{
				// 		where: {
				// 			id: data.userId,
				// 		},
				// 	}
				// )
				// .then((data) => {

				// 	console.log("users updated")

				// });

				return helpers.appresponse(res, 200, true, data, "success");
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const getProjectUsersBasedOnId = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		if (!reqObj.userId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"User id is required"
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

		await projectUsers
			.findOne({
				where: {
					userId: reqObj.userId,
					companyId: reqObj.companyId,
					isActive: true,
					status: false,
				},
			})

			.then(async (teamuserData) => {
				//console.log(teamuserData.teamId, "DateamuserDatata");

				await projectUsers
					.findAll({
						where: {
							companyId: reqObj.companyId,
							isActive: true,
							status: false,
							userId: {
								$notIn: [reqObj.userId],
							},
							teamId: teamuserData.projectId,
						},
						include: [users, positions],
					})
					.then((teamDataUser) => {
						return helpers.appresponse(
							res,
							200,
							true,
							teamDataUser,
							"projectusers listed successfully."
						);
					});
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const getProjectUser = async (req, res) => {
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
		if (!reqObj.projectId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"ProjectId  id is required"
			);
		}
		console.log("companyId-->", reqObj.companyId);
		console.log("teamId-->", reqObj.teamId);
		await projectUsers
			.findAll({
				where: {
					companyId: reqObj.companyId,
					projectId: reqObj.projectId,
					isActive: true,
					status: false,
				},
				include: [users,],
			})

			.then((teamuserData) => {
				// console.log(Data, "Data");
				return helpers.appresponse(
					res,
					200,
					true,
					teamuserData,
					"project users listed successfully."
				);
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const getOneProjectUser = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("Request id ", reqObj.id);
		projectUsers
			.findOne({
				where: {
					id: reqObj.id,
				},
				include: [users, positions],
			})

			.then((projectData) => {
				console.log("teamData", teamData);
				if (projectData) {
					return helpers.appresponse(
						res,
						200,
						true,
						projectData,
						"success"
					);
				} else {
					return helpers.appresponse(
						res,
						404,
						false,
						[],
						"No project users found for the user " + reqObj.id
					);
				}
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const deleteProjectUser = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		if (!reqObj.id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"projectuser id is required"
			);
		}
		console.log("request id", reqObj.id);

		projectUsers
			.update(
				{
					status: true,
					isActive: false,
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

	const getprojectforuserid = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		if (!reqObj.userId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"User id is required"
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

		var response = {};
		var projectData = await projectUsers
		.findAll({
			where: {
				userId : reqObj.userId,
				isActive: true,
				status: false,
			},
			include: [{
				model : users,
				},
				{
					model : projects,
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
					
					}
			],

		})
		

	
		var projectLeader = await projects.findAll({
			where :{
				[Op.or]:[
					{
						'teamleaderId' : reqObj.userId
					},
					{
						'managerId' : reqObj.userId
					}
				]
				
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

		var TeamLeader = await teams.findAll({
			where :{
				[Op.or]:[
					{
						'teamLeaderId' : reqObj.userId
					},
					{
						'teamManagerId' : reqObj.userId
					}
				]
				
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

		console.log("projectLeader",projectLeader)
		var projectArray = []
		if(projectLeader.length != 0)
		{
			//response.isProjectManager = true
			

			projectLeader.forEach((obj) =>{

			var dictionary = {};
			dictionary["project"] = obj
				projectArray.push(obj)
			})
			response.projectdata  = projectArray
		}
		else{
		//	response.isProjectManager = false
			projectData.forEach((obj) =>{

				
					projectArray.push(obj.project)
				})
			response.projectdata = projectArray
		}
		
		
			
			var teamData = await teamusers
		.findAll({
			where: {
				userId : reqObj.userId,
				isActive: true,
				status: false,
			},
			include: [
				{
					model : users,
				},
				{
					model : teams,
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
					
					}
			],

		});
		var teamArray = []
		if(TeamLeader.length != 0)
		{
			TeamLeader.forEach((obj) =>{

				
				teamArray.push(obj)
				})
				response.teamData  = teamArray
			//response.isTeamManager = true	
			// response.teamData = TeamLeader
			
		}
		else{

			
			teamData.forEach((obj) =>{

				
				teamArray.push(obj.team)
			})
		//response.projectdata = projectArray
			//response.isTeamManager = false	
			response.teamData = teamArray
		}

		var userObj = await users.findOne({
			where:{
				id : reqObj.userId
			},
			
		})
		var companieObj = await companies.findOne({
			where:{
				id : reqObj.companyId
			},
			
		})

		response.userData = userObj
			
		response.companyData = companieObj

			return helpers.appresponse(
				res,
				200,
				true,
				response,
				"sucess"
			);

		

		

	};

	const updateProjectUser = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		if (!reqObj.id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"projectuser id is required"
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
		if (!reqObj.userId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"User id is required"
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
		// if (!reqObj.position_id) {
		// 	return helpers.appresponse(
		// 		res,
		// 		404,
		// 		false,
		// 		null,
		// 		"Position id is required"
		// 	);
		// }
		console.log("request id", reqObj.id);

		const teamusersData = await projectUsers.findOne({
			where: {
				userId: reqObj.userId,
				isActive: true,
			},
		});
		console.log("teamusersData-->", teamusersData);

		console.log("reqObj.teamId", reqObj.projectId);

		if (
			teamusersData &&
			teamusersData.userId &&
			teamusersData.projectId === reqObj.projectId
		) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"User already assigned to this project."
			);
		} else if (
			teamusersData &&
			teamusersData.userId &&
			teamusersData.projectId !== reqObj.projectId
		) {
			console.log("===Update===>");
			await projectUsers
				.update(
					{
						isActive: false,
					},
					{
						where: {
							id: reqObj.id,
						},
					}
				)
				.then(async (data) => {
					const authHeader = req.headers.authorization;
					let createdByUserId = await helpers.getUserId(authHeader);
					// console.log("createdByUserId-->", createdByUserId);
					if (createdByUserId && createdByUserId !== undefined) {
						reqObj.createdAt = Date.now();
						reqObj.createdBy = createdByUserId;
						delete reqObj.id;
					}
					console.log("reqObj-->", reqObj);

					projectUsers
						.create(reqObj)
						.then((teamuserData) => {
							return helpers.appresponse(
								res,
								200,
								true,
								teamuserData,
								"Team user updated and added successfully"
							);
						})
						.catch((err) => {
							return helpers.appresponse(
								res,
								404,
								false,
								null,
								err.message
							);
						});
				})
				.catch((err) => {
					return helpers.appresponse(
						res,
						404,
						false,
						null,
						err.message
					);
				});
		} else {
			console.log("====else part===");
			const authHeader = req.headers.authorization;
			let updatedByUserId = await helpers.getUserId(authHeader);
			if (updatedByUserId && updatedByUserId !== undefined) {
				reqObj.updatedAt = Date.now();
				reqObj.updatedBy = updatedByUserId;
			}

			projectUsers
				.update(reqObj, {
					where: {
						id: reqObj.id,
					},
				})
				.then((data) => {
					return helpers.appresponse(res, 200, true, [], "success");
				})
				.catch((err) => {
					return helpers.appresponse(
						res,
						404,
						false,
						null,
						err.message
					);
				});
		}
	};

	const removeFromProject = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		if (!reqObj.id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"projectuser id is required"
			);
		}
		console.log("request id", reqObj.id);

		projectUsers
			.update(
				{
					isActive: false,
				},
				{
					where: {
						id: reqObj.id,
					},
				}
			)
			.then((data) => {
				return helpers.appresponse(res, 200, true, [], "Teamuser removed from Team.");
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	return {
        createProjectUser,
		getProjectUser,
		getOneProjectUser,
		deleteProjectUser,
		updateProjectUser,
		getProjectId,
		positionUpdate,
	
		checkMyUserIdInTopPosition,
		getProjectUsersBasedOnId,
		removeFromProject,
		getprojectforuserid
	};
};

export default projectUsersController();
