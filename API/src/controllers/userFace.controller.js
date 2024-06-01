import _ from "lodash";
import db from "../../config/sequelize";
import helpers from "../helpers/helper";
const {
	users,
	faces,
	findedfaces,
} = db;
const Op = db.Sequelize.Op;

const UserFaceController = () => {
	const create = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log(reqObj);
		console.log(JSON.stringify(reqObj));


		if (!reqObj.employeeId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"employeeId is required"
			);
		}

		var userdata = await users.findOne({
			where: {
				employeeId: reqObj.employeeId,
			},
		});
		console.log("userdata", userdata);
		if (userdata && userdata.employeeId) {
			reqObj.userKey = userdata.id.toFixed(2);
			reqObj.userId = userdata.id;



			faces.findAll({
					where: {
						userId: reqObj.userId
					},
				}).then((facedata) => {
					console.log("facedata.length", facedata.length);
					console.log(facedata);
					if (facedata.length == 0) {
						reqObj.userKey = +userdata.id + +0.01;
						console.log("reqObj.userKey", reqObj.userKey);
					} else {
						console.log(facedata[facedata.length - 1].dataValues.userKey);
						reqObj.userKey = +facedata[facedata.length - 1].dataValues.userKey + +0.01;
						console.log("reqObj.userKey", reqObj.userKey);
					}



					faces.create(reqObj)
						.then((userData) => {
							return helpers.appresponse(
								res,
								200,
								true,
								userData,
								"face data added successfully."
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
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Employee id not found with registred users."
			);

		}


	};

	const getAllFaces = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		//  console.log("reqobj",reqObj)
		faces.findAll().then((facesData) => {
			// var faceTempData = []

			var faceTempData = []; // create an empty array
			var dict = {}

			facesData.forEach((obj) => {



				dict[obj.dataValues.userKey] = JSON.parse(obj.dataValues.faceData);
				//console.log("dict",dict)
				// faceTempData.push(dict)


				//     console.log("array",dict)
				// //  var elem =    +":"+obj.dataValues.faceData
				//  // console.log("elem",elem)

				//   faceTempData.push(dict)
				//	console.log("faceTempData",faceTempData)



			});


			return helpers.appresponse(res,
				200,
				true,
				dict,
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

	const getname = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("reqobj", reqObj)

		users.findOne({
				where: {
					id: reqObj.id,
				},
			}).then((userData) => {
				console.log("userData", JSON.stringify(userData));
				findedfaces.create({
					userId: userData.id,
					userName: userData.userName,
				})
				return helpers.appresponse(
					res,
					200,
					true,
					userData,
					"success."
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
			});;


	}

	return {
		create,
		getAllFaces,
		getname

	};
};

export default UserFaceController();
