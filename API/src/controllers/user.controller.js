import _ from "lodash";
import utils from "../services/utils.service";
import db from "../../config/sequelize";
import helpers from "../helpers/helper";
import moment from "moment";
const excel = require("exceljs");

import QRCode from "qrcode";
import notificationService from "../services/notification.service";

const { users, companies, roles, positions } = db;
const Op = db.Sequelize.Op;

const UserController = () => {
	const create = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		if (!req.file) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"profile image is required"
			);
		}
		const imagename = req.file.filename;
		if (!reqObj.firstName) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"firstName is required"
			);
		}
		if (!reqObj.lastName) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"lastName is required"
			);
		}
		if (!reqObj.email) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"email is required"
			);
		}
		if (!reqObj.password) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"password is required"
			);
		}
		if (!reqObj.designation) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"designation is required"
			);
		}
		if (!reqObj.mobileNumber) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"mobileNumber is required"
			);
		}
		if (!reqObj.DOB) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"DOB is required"
			);
		}
		if (!reqObj.gender) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"gender is required"
			);
		}
		if (!reqObj.roleId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"roleId is required"
			);
		}

		if (!reqObj.employeeId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"employeeId is required"
			);
		}
		if (!reqObj.companyId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Company Id is required"
			);
		}
		var companyData = await companies.findOne({
			where: {
				id: reqObj.companyId,
			},
			// include: [users]
		});
		var balance = await balanceLeave();
		reqObj.numberOfLeaves = balance;
		reqObj.profile = imagename;
		reqObj.userName = reqObj.firstName + " " + reqObj.lastName;
		reqObj.token = helpers.gettoken(reqObj.username, reqObj.email);
		reqObj.createdAt = Date.now();
		reqObj.updateddAt = Date.now();
		reqObj.isActive = true;
		var userdatas = await users.findOne({
			where: {
				email: reqObj.email,
			},
		});
		if (userdatas && userdatas.email) {
			utils.deleteFile(imagename);
			return helpers.appresponse(
				res,
				404,
				false,
				[],
				"Email Id is already  exist"
			);
		}
		var userdatabyempid = await users.findOne({
			where: {
				employeeId: reqObj.employeeId,
			},
		});
		if (userdatabyempid && userdatabyempid.employeeId) {
			utils.deleteFile(imagename);
			return helpers.appresponse(
				res,
				404,
				false,
				[],
				"employeeId is already exist."
			);
		}
		// roles.findAndCountAll()
		//  .then(result => {
		//      console.log(" result.count " + result.count);
		//      console.log("result.count rows" + result.rows);
		//      if (result.count === 0) {
		//          rolecontoller.initialcreate();
		//      }
		//  })
		//  .catch(err => {
		//      throw err;
		//  });

		users
			.create(reqObj)
			.then((userData) => {
				users
					.findByPk(userData.id, {
						attributes: {
							exclude: ["password", "userOtp"],
						},
					})
					.then((userData) => {
						const maildata = {
							name: userData.userName,
							email: userData.email,
							to: userData.email,
							sub: "QR Code",
						};
						const replacementsToimage = {
							id: userData.id,
							name: userData.userName,
							email: userData.email,
						};
						let strData = JSON.stringify(replacementsToimage);
						QRCode.toDataURL(strData, function (err, code) {
							if (err) return console.log("error occurred");
							utils.generateQRCode(maildata, code, true);
						});

						return helpers.appresponse(
							res,
							200,
							true,
							userData,
							"user added successfully"
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
				utils.deleteFile(imagename);
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const getbyid = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		users
			.findByPk(reqObj.id, {
				attributes: {
					exclude: ["password", "userOtp"],
				},

				include: [
					{
						model: companies,
					},
					{
						model: roles,
					},
					{
						model: positions,
					},
				],
			})
			.then((userData) => {
				if (userData) {
					const replacementsToimage = {
						id: userData.id,
						name: userData.userName,
						email: userData.email,
						time: moment().format("HH:mm"),
					};
					let strData = JSON.stringify(replacementsToimage);
					QRCode.toDataURL(strData, function (err, code) {
						if (err) return console.log("error occurred");
						userData.setDataValue("code", code);
						return helpers.appresponse(
							res,
							200,
							true,
							userData,
							"success"
						);
					});
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
	const getall = async (req, res) => {

		console.log("getall called")
		const reqObj = helpers.getReqValues(req);
		let cond = {};
		cond["email"] = {
			$notIn: ["hrm@greatinnovus.com"],
		};
		cond["companyId"] = reqObj.companyId;
		cond["isActive"] = true;
		if (reqObj.userName) {
			// cond[Op.or]=[{
			cond["userName"] = {
				//  userName: {
				[Op.like]: "%" + reqObj.userName + "%",
				// },
				// }]
			};

			console.log("reqb",cond)
			users
				.findAll({
					where: cond,
					// {
					//  id: {
					//      $ne: 1
					//  },
					//  companyId: reqObj.companyId
					// },
					// {
					//  userName: {
					//      [Op.like]: '%' + reqObj.companyId + '%'
					//  }
					// },
					order: [["userName", "ASC"]],
					attributes: {
						exclude: ["password", "userOtp"],
					},
					include: [companies, roles, positions],
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
					return helpers.appresponse(
						res,
						404,
						false,
						null,
						err.message
					);
				});
		}

		// let userData = await users.findAndCountAll({
		//  where: cond,
		//  order: [["id", "DESC"]],

		// })
		else {
			// console.log("else part exected")

			users
				.findAll({
					where: {
						id: {
							$ne: 1,
						},
						companyId: reqObj.companyId,
						isActive : true,
					},
					// {
					//  userName: {
					//      [Op.like]: '%' + reqObj.companyId + '%'
					//  }
					// },
					order: [["userName", "ASC"]],
					attributes: {
						exclude: ["password", "userOtp"],
					},
					include: [companies, roles, positions],
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
	const balanceLeave = async () => {
		let date = new Date();
		var month = date.getMonth() + 1;
		var monthDate = date.getDate();
		var secondroundoff;
		var company = await companies.findOne({
			where: {
				id: 1,
			},
			// include: [users]
		});
		if (monthDate >= 20) {
			var months = month + 1;
			var totalMonths = 12 - months;
			var totalDay = totalMonths * company.noOfLeaves;
			var totalValue = totalDay / 12;
			var roundoff = Math.round(totalValue);
			secondroundoff = roundoff.toFixed(2);
		} else {
			var totalMotnhs = 12 - month;
			var totalDays = totalMotnhs * company.noOfLeaves;
			var totalValues = totalDays / 12;
			var roundoff = Math.round(totalValues);
			secondroundoff = roundoff.toFixed(2);
		}
		return secondroundoff;
	};

	const getMonthBirthday = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		if (!reqObj.companyId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"company Id required"
			);
		}
		if (!reqObj.monthDate) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Date is required"
			);
		}
		users
			.findAll({
				where: {
					companyId: reqObj.companyId,
					isActive: true,
				},
				attributes: {
					exclude: ["password", "userOtp"],
				},
			})
			.then((userData) => {
				let userArray = [];
				userData.forEach((obj) => {
					const month = obj.dataValues.DOB.split("-");

					if (month[1] == reqObj.monthDate) {
						userArray.push(obj);
					}
				});
				if (userArray) {
					// if (userArray && userArray.length != 0) {

					let userlist = [];
					let slNo = 1;
					userArray.forEach((obj) => {
						userlist.push({
							SNo: slNo,
							EmployeeCode: obj.employeeId,
							Name: obj.userName,
							Email: obj.email,
							DOB: obj.DOB,
						});
						slNo = slNo + 1;
					});
					let workbook = new excel.Workbook();
					let worksheet = workbook.addWorksheet("Userlist");
					worksheet.columns = [
						{
							header: "S No",
							key: "SNo",
							width: 5,
						},
						{
							header: "Employee Code",
							key: "EmployeeCode",
							width: 15,
						},
						{
							header: "Name",
							key: "Name",
							width: 20,
						},
						{
							header: "Email",
							key: "Email",
							width: 25,
						},
						{
							header: "DOB",
							key: "DOB",
							width: 15,
						},
					];
					worksheet.addRows(userlist);
					res.setHeader(
						"Content-Type",
						"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
					);
					res.setHeader(
						"Content-Disposition",

						"attachment; filename=" + `birthdaylist.xlsx`
					);
					return workbook.xlsx.write(res).then(function () {
						res.status(200).end();
					});

					// return helpers.appresponse(
					// 	res,
					// 	200,
					// 	true,
					// 	userData,
					// 	"success"
					// );
					// } else {
					// 	return helpers.appresponse(
					// 		res,
					// 		404,
					// 		false,
					// 		[],
					// 		"No Users Found for CompanyId=" + reqObj.companyId
					// 	);
					// }
				} else {
					return helpers.appresponse(
						res,
						404,
						false,
						[],
						"No Data found for the date " + reqObj.id
					);
				}
				
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};
	const getTodayBirthday = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		if (!reqObj.companyId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"company Id required"
			);
		}
		if (!reqObj.todayDate) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Date is required"
			);
		}
		users
			.findAll({
				where: {
					companyId: reqObj.companyId,
					isActive: true,
				},
				attributes: {
					exclude: ["password", "userOtp"],
				},
			})
			.then((userData) => {
				let userArray = [];
				userData.forEach((obj) => {
					if (obj.dataValues.DOB.includes(reqObj.todayDate)) {
						userArray.push(obj);
					}
				});
				if (userArray) {
					return helpers.appresponse(
						res,
						200,
						true,
						userArray,
						"success"
					);
				} else {
					return helpers.appresponse(
						res,
						404,
						false,
						[],
						"No Data found for the date " + reqObj.id
					);
				}
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};
	const sendWishes = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		if (!reqObj.userId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"user Id required"
			);
		}

		users
			.findOne({
				where: {
					id: reqObj.userId,
				},
				attributes: {
					//exclude: ["firstOut", ]
				},
			})
			.then(async (userData) => {
				//console.log("userdata",userData.dataValues.email)
				var wisherUserdata = await users.findOne({
					where: {
						id: reqObj.myUserId,
					},
				});

				notificationService.singlepushnotification(
					userData.dataValues.email,
					reqObj.wishesTxt == ""
						? " Wishing you a happy birthday and a wonderful year " +
								" \nby " +
								wisherUserdata.dataValues.userName
						: reqObj.wishesTxt +
								" \nby " +
								wisherUserdata.dataValues.userName
				);
				return helpers.appresponse(
					res,
					200,
					true,
					[],
					"Notification sended successfully"
				);
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const updateprofile = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		if (!reqObj.userId) {
			if (req.file) {
				const imagename = req.file.filename;
				utils.deleteFile(imagename);
			}

			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"user Id required"
			);
		}

		if (req.file) {
			const imagename = req.file.filename;
			reqObj.profile = imagename;
		}
		users.findOne({
			where:{
				id: reqObj.userId
			}
		}).then((userObj) =>{

			console.log("Deleted profile image name is",userObj.profile)
			utils.deleteFile(userObj.profile);
		})
		users
			.update(reqObj, {
				where: {
					id: reqObj.userId,
				},
			})
			.then(async (response) => {
				var updateddata = await users.findOne({
					where: {
						id: reqObj.userId,
					},
					attributes: {
						exclude: ["password", "deviceId", "fcmToken"],
					},
				});
				return helpers.appresponse(
					res,
					200,
					true,
					updateddata,
					"profile updated successfully"
				);
			})
			.catch((err) => {
				utils.deleteFile();
				return res, 404, false, null, "Image deleted successfully";
			});
	};

	const download = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		let cond = {};
		cond["email"] = {
			$notIn: ["stevej.india@gmail.com"],
		};
		cond["companyId"] = reqObj.companyId;

		users
			.findAll({
				where: cond,
				order: [["userName", "ASC"]],
				attributes: {
					exclude: ["password", "userOtp"],
				},
				include: [
					{
						model: companies,
						required: false,
					},
					{
						model: roles,
						//as: "roleId",
						//attributes: ["id"],
						required: false,
					},
				],
			})
			.then((userData) => {
				if (userData && userData.length != 0) {
					let userlist = [];
					let slNo = 1;
					userData.forEach((obj) => {
						userlist.push({
							SNo: slNo,
							EmployeeCode: obj.employeeId,
							Name: obj.userName,
							Email: obj.email,
							ContactNo: obj.mobileNumber,
							FirstName: obj.firstName,
							LastName: obj.lastName,
							DOB: obj.DOB,
							Gender: obj.gender,
							Designation: obj.designation,
							Status: obj.isActive ? "Active" : "InActive",
						});
						slNo = slNo + 1;
					});
					let workbook = new excel.Workbook();
					let worksheet = workbook.addWorksheet("Userlist");
					worksheet.columns = [
						{
							header: "S No",
							key: "SNo",
							width: 5,
						},
						{
							header: "Employee Code",
							key: "EmployeeCode",
							width: 15,
						},
						{
							header: "Name",
							key: "Name",
							width: 20,
						},
						{
							header: "Email",
							key: "Email",
							width: 25,
						},
						{
							header: "Contact No",
							key: "ContactNo",
							width: 15,
						},
						{
							header: "First Name",
							key: "FirstName",
							width: 15,
						},
						{
							header: "Last Name",
							key: "LastName",
							width: 10,
						},
						{
							header: "DOB",
							key: "DOB",
							width: 15,
						},
						{
							header: "Gender",
							key: "Gender",
							width: 10,
						},
						{
							header: "Designation",
							key: "Designation",
							width: 20,
						},
						{
							header: "Status",
							key: "Status",
							width: 5,
						},
					];
					worksheet.addRows(userlist);
					res.setHeader(
						"Content-Type",
						"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
					);
					res.setHeader(
						"Content-Disposition",

						"attachment; filename=" + `Users.xlsx`
					);
					return workbook.xlsx.write(res).then(function () {
						res.status(200).end();
					});

					// return helpers.appresponse(
					// 	res,
					// 	200,
					// 	true,
					// 	userData,
					// 	"success"
					// );
				} else {
					return helpers.appresponse(
						res,
						404,
						false,
						[],
						"No Users Found for CompanyId=" + reqObj.companyId
					);
				}
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	return {
		create,
		getbyid,
		getall,
		balanceLeave,
		updateprofile,
		download,
		getTodayBirthday,
		getMonthBirthday,
		sendWishes,
	};
};

export default UserController();
