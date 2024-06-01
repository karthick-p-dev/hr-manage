import _ from "lodash";
import db from "../../config/sequelize";
import helpers from "../helpers/helper";
import utils from "../services/utils.service";

const { users, teamusers, positions, teams } = db;
const Op = db.Sequelize.Op;

const teamUsersController = () => {
	const createTeamUser = async (req, res) => {
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
		if (!reqObj.teamId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Team id is required"
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

		const teamusersData = await teamusers.findOne({
			where: {
				userId: reqObj.userId,
				isActive: true,
			},
		});
		console.log("teamusersData-->", teamusersData);

		console.log("reqObj.teamId", reqObj.teamId);
		//console.log("teamusersData.teamId", teamusersData.teamId);

		if (
			teamusersData &&
			teamusersData.userId &&
			teamusersData.teamId === reqObj.teamId
		) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"User already assigned to this team."
			);
		} else if (
			teamusersData &&
			teamusersData.userId &&
			teamusersData.teamId !== reqObj.teamId
		) {
			const authHeader = req.headers.authorization;
			let createdByUserId = await helpers.getUserId(authHeader);
			// console.log("createdByUserId-->", createdByUserId);
			if (createdByUserId && createdByUserId !== undefined) {
				reqObj.createdAt = Date.now();
				reqObj.createdBy = createdByUserId;
			}

			await users
				.update(
					{
						deviceId: "",
						token: "",
					},
					{
						where: {
							id: reqObj.userId,
						},
					}
				)
				.then((data) => {});

			teamusers
				.create(reqObj)
				.then((teamuserData) => {
					return helpers.appresponse(
						res,
						200,
						true,
						teamuserData,
						"Team user added successfully"
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
			// console.log("===Update===>");
			// teamusers
			// 	.update(
			// 		{
			// 			isActive: false,
			// 		},
			// 		{
			// 			where: {
			// 				id: teamusersData.id,
			// 			},
			// 		}
			// 	)
			// 	.then(async (data) => {
			// 		const authHeader = req.headers.authorization;
			// 		let createdByUserId = await helpers.getUserId(authHeader);
			// 		// console.log("createdByUserId-->", createdByUserId);
			// 		if (createdByUserId && createdByUserId !== undefined) {
			// 			reqObj.createdAt = Date.now();
			// 			reqObj.createdBy = createdByUserId;
			// 		}

			// 		await users
			// 			.update(
			// 				{
			// 					deviceId: "",
			// 					token: "",
			// 				},
			// 				{
			// 					where: {
			// 						id: reqObj.userId,
			// 					},
			// 				}
			// 			)
			// 			.then((data) => {

			// 			});

			// 		teamusers
			// 			.create(reqObj)
			// 			.then((teamuserData) => {
			// 				return helpers.appresponse(
			// 					res,
			// 					200,
			// 					true,
			// 					teamuserData,
			// 					"Team user added successfully"
			// 				);
			// 			})
			// 			.catch((err) => {
			// 				return helpers.appresponse(
			// 					res,
			// 					404,
			// 					false,
			// 					null,
			// 					err.message
			// 				);
			// 			});
			// 	})
			// 	.catch((err) => {
			// 		return helpers.appresponse(
			// 			res,
			// 			404,
			// 			false,
			// 			null,
			// 			err.message
			// 		);
			// 	});
		} else {
			const authHeader = req.headers.authorization;
			let createdByUserId = await helpers.getUserId(authHeader);
			// console.log("createdByUserId-->", createdByUserId);
			if (createdByUserId && createdByUserId !== undefined) {
				reqObj.createdAt = Date.now();
				reqObj.createdBy = createdByUserId;
			}

			await users
				.update(
					{
						deviceId: "",
						token: "",
					},
					{
						where: {
							id: reqObj.userId,
						},
					}
				)
				.then((data) => {});

			teamusers
				.create(reqObj)

				.then((teamuserData) => {
					return helpers.appresponse(
						res,
						200,
						true,
						teamuserData,
						"Team user added successfully"
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

	const getTeamId = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("companyId-->", reqObj.companyId);
		console.log("teamId-->", reqObj.userId);
		await teamusers
			.findAll({
				where: {
					companyId: reqObj.companyId,
					userId: reqObj.userId,
					isActive: true,
					status: false,
				},
				include: [users, positions, teams],
			})

			.then((teamuserData) => {
				// console.log(Data, "Data");
				return helpers.appresponse(
					res,
					200,
					true,
					teamuserData,
					"Teamusers listed successfully."
				);
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const getEmployeeBasedOnPosition = async (req, res) => {
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
		if (!reqObj.position_id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"position id is required"
			);
		}
		await teamusers
			.findAll({
				where: {
					companyId: reqObj.companyId,
					position_id: reqObj.position_id,
					isActive: true,
					status: false,
				},
				include: [users, positions, teams],
			})

			.then((teamuserData) => {
				// console.log(Data, "Data");
				return helpers.appresponse(
					res,
					200,
					true,
					teamuserData,
					"Teamusers listed successfully."
				);
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const checkMyUserIdInTopPosition = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		if (!reqObj.userId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Team user id is required"
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
				include: [users, positions, teams],
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

		teamusers
			.findOne({
				where: {
					id: reqObj.id,
				},
			})
			.then(async (teamData) => {
				console.log("teamData", teamData);
				// await users
				// 	.update(
				// 		{
				// 			deviceId: "",
				// 			token: "",
				// 		},
				// 		{
				// 			where: {
				// 				id: teamData.userId,
				// 			},
				// 		}
				// 	)
				// 	.then((data) => {
				// 		console.log("users updated");
				// 	});
			});
		await teamusers
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

	const getTeamUsersBasedOnId = async (req, res) => {
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

		await teamusers
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

				await teamusers
					.findAll({
						where: {
							companyId: reqObj.companyId,
							isActive: true,
							status: false,
							userId: {
								$notIn: [reqObj.userId],
							},
							teamId: teamuserData.teamId,
						},
						include: [users, positions],
					})
					.then((teamDataUser) => {
						return helpers.appresponse(
							res,
							200,
							true,
							teamDataUser,
							"Teamusers listed successfully."
						);
					});
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const getTeamUser = async (req, res) => {
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
		if (!reqObj.teamId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Team  id is required"
			);
		}
		console.log("companyId-->", reqObj.companyId);
		console.log("teamId-->", reqObj.teamId);
		await teamusers
			.findAll({
				where: {
					companyId: reqObj.companyId,
					teamId: reqObj.teamId,
					isActive: true,
					status: false,
				},
				include: [users],
			})

			.then((teamuserData) => {
				// console.log(Data, "Data");
				return helpers.appresponse(
					res,
					200,
					true,
					teamuserData,
					"Teamusers listed successfully."
				);
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const getOneTeamUser = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("Request id ", reqObj.id);
		teamusers
			.findOne({
				where: {
					id: reqObj.id,
				},
				include: [users, positions],
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
						"No team users found for the user " + reqObj.id
					);
				}
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const deleteTeamUser = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		if (!reqObj.id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Teamuser id is required"
			);
		}
		console.log("request id", reqObj.id);

		teamusers
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

	const updateTeamUser = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		if (!reqObj.id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Teamuser id is required"
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
		if (!reqObj.teamId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Team id is required"
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

		const teamusersData = await teamusers.findOne({
			where: {
				userId: reqObj.userId,
				isActive: true,
			},
		});
		console.log("teamusersData-->", teamusersData);

		console.log("reqObj.teamId", reqObj.teamId);

		if (
			teamusersData &&
			teamusersData.userId &&
			teamusersData.teamId === reqObj.teamId
		) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"User already assigned to this team."
			);
		} else if (
			teamusersData &&
			teamusersData.userId &&
			teamusersData.teamId !== reqObj.teamId
		) {
			console.log("===Update===>");
			await teamusers
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

					teamusers
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

			teamusers
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

	const removeFromTeam = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		if (!reqObj.id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Teamuser id is required"
			);
		}
		console.log("request id", reqObj.id);

		teamusers
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
		createTeamUser,
		getTeamUser,
		getOneTeamUser,
		deleteTeamUser,
		updateTeamUser,
		getTeamId,
		positionUpdate,
		getEmployeeBasedOnPosition,
		checkMyUserIdInTopPosition,
		getTeamUsersBasedOnId,
		removeFromTeam
	};
};

export default teamUsersController();
