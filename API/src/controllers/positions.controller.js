import _ from "lodash";
import db from "../../config/sequelize";
import helpers from "../helpers/helper";

const { task, users, task_type, positions, teamusers, teams } = db;
const Op = db.Sequelize.Op;

const positionController = () => {
	const createPosition = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("reqObj", reqObj);

		if (!reqObj.parentId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Parent id is required"
			);
		}
		if (!reqObj.name) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Position name is required"
			);
		}

		var positiondata = await positions.findOne({
			where: {
				name: reqObj.name,
				status: false,
			},
		});
		// console.log('positiondata-->',positiondata)
		if (positiondata && positiondata.name) {
			return helpers.appresponse(
				res,
				404,
				false,
				[],
				"Position name is already exists!"
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

		positions
			.create(reqObj)

			.then((data) => {
				return helpers.appresponse(
					res,
					200,
					true,
					data,
					"Position added successfully"
				);
			})

			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const getAllPositions = async (req, res) => {
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
		await positions
			.findAll({
				where: {
					companyId: reqObj.companyId,
					status: false,
				},
				include: [positions],
			})
			.then((Data) => {
				return helpers.appresponse(
					res,
					200,
					true,
					Data,
					"Positions listed successfully."
				);
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const getPositionBasedOnTopPosition = async (req, res) => {
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

		await positions
			.findAll({
				where: {
					companyId: reqObj.companyId,
					status: false,
					topPosition: true,
				},
			})
			.then(async (Data) => {
				let userData = [];

				for await (const obj of Data) {
					const userResponse = await teamusers.findAll({
						where: {
							position_id: obj.id,
							companyId: reqObj.companyId,
							// userId : !reqObj.userId,
							isActive: true,
							status: false,
						},
						include: [users, positions, teams],
					});

					userResponse.forEach((userObj) => {
						userData.push(userObj.user);
					});
				}

				const userDataObj = await users.findAll({
					where: {
						roleId: 2,
						companyId: reqObj.companyId,
						isActive: true,
					},
				});

				userDataObj.forEach((obj) => {
					userData.push(obj);
				});
				console.log("userData", userData.length);
				console.log("ddata", Data);
				let uniqueChars = [
					...new Map(
						userData.map((item) => [item["id"], item])
					).values(),
				];

				// uniqueChars.splice(uniqueChars.findIndex(function(i){
				// 	console.log("idd",i.id,i.email)
				// 	return i.id === reqObj.userId;
				// }), 1);

				// const findIndex = uniqueChars.findIndex(a => a.id === reqObj.userId)
				// console.log('indexx',findIndex)

				let filteredPeople = [];
				for await (const obj of uniqueChars) {
					if (Number(obj.id) !== Number(reqObj.userId)) {
						filteredPeople.push(obj);
					}
				}
				// const filteredPeople =  uniqueChars.filter((item) =>
				// {
				// 	console.log("itemid",Number(item.id) !== Number(reqObj.userId),item.id,reqObj.userId)
				// 	Number(item.id) !== Number(reqObj.userId)
				// });

				console.log("filteredPeople", filteredPeople);
				// 	var bar = new Promise((resolve, reject) => {
				// 	Data.forEach(async function(obj)  {

				// 		const userResponse = await teamusers.findAll({
				// 			where: {
				// 				position_id: obj.id,
				// 				companyId: reqObj.companyId,
				// 				isActive: true,
				// 				status: false,
				// 			},
				// 			include: [users, positions, teams],
				// 		})

				// 		userResponse.forEach((userObj) => {
				// 			userData.push(userObj)

				// 		})
				// 		console.log("userData", userData.length)

				// 	})
				// });
				// bar.then(() => {
				// 	return helpers.appresponse(
				// 		res,
				// 		200,
				// 		true,
				// 		userData,
				// 		"Positions listed successfully ."
				// 	);
				// });

				return helpers.appresponse(
					res,
					200,
					true,
					filteredPeople,
					"Positions listed successfully ."
				);

				// Data.forEach(async (obj) => {

				// 	console.log('OBj',obj)

				// 	const res = await teamusers.findAll({
				// 		where:{
				// 			position_id : obj.id
				// 		}
				// 	})
				// 	//console.log("team users",res)
				// 	userData.push(res)
				// 	console.log("userdatavalue",userData.length)
				// }

				// );

				//console.log("userdatavalue",userData)
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};
	const getOnePosition = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("Request id ", reqObj.id);
		positions
			.findOne({
				where: {
					id: reqObj.id,
				},
			})

			.then((posData) => {
				if (posData) {
					return helpers.appresponse(
						res,
						200,
						true,
						posData,
						"success"
					);
				} else {
					return helpers.appresponse(
						res,
						404,
						false,
						[],
						"No position found."
					);
				}
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const deletePosition = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		if (!reqObj.id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Position id is required"
			);
		}

		positions
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

	const updatePosition = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("request id", reqObj.id);

		if (!reqObj.id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Position id is required"
			);
		}
		if (!reqObj.name) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Position name is required"
			);
		}

		let cond = {};
		cond["name"] = reqObj.name;
		cond["status"] = false;
		cond["id"] = {
			$notIn: [reqObj.id],
		};
		var positiondata = await positions.findOne({
			where: cond,
		});
		if (positiondata && positiondata.name) {
			return helpers.appresponse(
				res,
				404,
				false,
				[],
				"Position name is already exists!"
			);
		}

		const authHeader = req.headers.authorization;
		let updatedByUserId = await helpers.getUserId(authHeader);
		// console.log("updatedByUserId-->", updatedByUserId);
		if (updatedByUserId && updatedByUserId !== undefined) {
			reqObj.updatedAt = Date.now();
			reqObj.updatedBy = updatedByUserId;
		}

		positions
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
		createPosition,
		getAllPositions,
		getOnePosition,
		deletePosition,
		updatePosition,
		getPositionBasedOnTopPosition,
	};
};

export default positionController();
