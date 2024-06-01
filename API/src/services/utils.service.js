import _ from "lodash";
import nodemailer from "nodemailer";
import { google, GoogleApis } from "googleapis";
import fs from "fs";
import path from "path";
import Handlebars, { helpers } from "handlebars";
import config from "../../config/config";
import db from "../../config/sequelize";
import cron from "node-cron";
import NotificationService from "../services/notification.service";
import notificationService from "../services/notification.service";
import attendanceController from "../controllers/attendance.controller";
import moment from "moment";
import { use } from "passport";
import { emit, send } from "process";
const excel = require("exceljs");
var request = require("request");
const { promisify } = require("util");
const modelsDir = path.resolve("uploads/");
const { users, roles, leaves, attendances, companies, positions, emailSents } =
	db;
//const CLEINT_ID =
//const CLIENT_SECRET =
//const redirectUrl =
//const refreshToken =
//const oAuth2Client =
oAuth2Client.setCredentials({ refresh_token: refreshToken });

export default {
	async sendMailFromNode(sendoption) {
		try {
			const access = await oAuth2Client.getAccessToken();
			const transporter = nodemailer.createTransport({
				//host: config.smtpHost,
				service: "gmail",
				pool: true,
				auth: {
					user: config.commonEmail,
					type: "OAuth2",
					clientId: CLEINT_ID,
					clientSecret: CLIENT_SECRET,
					refreshToken: refreshToken,

					//pass: config.commonEmailPwd
					accessToken: access,
				},
			});

			transporter.sendMail(sendoption, function (error, info) {
				if (error) {
					console.log("send mail error : " + error.message);
					transporter.close();
				} else {
					console.log("Email sent: " + info.response);
					transporter.close();
				}
			});
		} catch (error) {
			return error;
		}
	},

	async sendMailFromNodeUsingUserId(sendoption, userId, email, subject) {
		try {
			const access = await oAuth2Client.getAccessToken();
			const transporter = nodemailer.createTransport({
				//host: config.smtpHost,
				service: "gmail",
				pool: true,
				auth: {
					user: config.commonEmail,
					type: "OAuth2",
					clientId: CLEINT_ID,
					clientSecret: CLIENT_SECRET,
					refreshToken: refreshToken,

					//pass: config.commonEmailPwd
					accessToken: access,
				},
			});

			transporter.sendMail(sendoption, async function (error, info) {
				if (error) {
					console.log("send mail error : " + error.message);

					await emailSents.create({
						userId: userId,
						email: email,
						subject: subject,
						isSent: false,
						createdAt: Date.now(),
						updateddAt: Date.now(),
					});
					transporter.close();
				} else {
					await emailSents.create({
						userId: userId,
						email: email,
						subject: subject,
						isSent: true,
						createdAt: Date.now(),
						updateddAt: Date.now(),
					});
					transporter.close();
					console.log("Email sent: " + info.response);
				}
			});
		} catch (error) {
			return error;
		}
	},
	generateOTP() {
		const min = 100000;
		const max = 999999;

		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	getReqValues(req) {
		return _.pickBy(_.extend(req.body, req.params, req.query), _.identity);
	},

	// password(user) {
	// 	const salt = bcrypt.genSaltSync(saltRounds);
	// 	const hash = bcrypt.hashSync(user.password, salt);

	// 	return hash;
	// },
	// updatePassword(pass) {
	// 	const salt = bcrypt.genSaltSync(saltRounds);
	// 	const hash = bcrypt.hashSync(pass, salt);

	// 	return hash;
	// },
	// comparePassword(pw, hash) {
	// 	const pass = bcrypt.compareSync(pw, hash);

	// 	return pass;
	// },

	unLinkFilePath(filePath) {
		return new Promise((resolve) => {
			fs.unlink(filePath, (err) => {
				if (err) {
					resolve({
						status: false,
						message: err,
					});
				} else {
					resolve({
						status: true,
					});
				}
			});
		});
	},

	getActivityLogs(notify) {
		return new Promise((resolve) => {
			try {
				const filePath = path.join(
					__dirname,
					"../constant/activitylog.json"
				);

				fs.readFile(filePath, "utf8", (err, res) => {
					if (err) {
						resolve({
							status: false,
							message: err,
						});
					} else {
						const notifyInfo = JSON.parse(res);

						resolve({
							status: true,
							data: notifyInfo[notify],
						});
					}
				});
			} catch (error) {
				resolve({
					status: false,
					message: error,
				});
			}
		});
	},

	// async transporter() {

	// 	const transporter = nodemailer.createTransport({
	// 		host: config.smtpHost,
	// 		auth: {
	// 			user: config.commonEmail,
	// 			pass: config.commonEmailPwd
	// 		}
	// 	});
	// 	return transporter
	// },

	sendWishesMail(mailOptions) {
		//this function needs otp , to addres , subject.

		var emailOtpTemplate = path.resolve("src/template/birthdaywishes.html");

		this.readHTMLFile(emailOtpTemplate, async (err, html) => {
			if (err) {
				console.log(err);
				return false;
			}
			const template = Handlebars.compile(html);
			const replacements = {
				wishesTxt: mailOptions.wishesTxt,
			};

			const htmlToSend = template(replacements);

			var sendoption = {
				from: config.commonEmail,
				to: mailOptions.to,
				subject: mailOptions.sub,
				html: htmlToSend,
			};
			this.sendMailFromNode(sendoption);
			// transporter.sendMail(sendoption, function (error, info) {
			// 	if (error) {
			// 		console.log("send mail error : " + error.message);
			// 	} else {
			// 		console.log("Email sent: " + info.response);
			// 	}
			// });
		});
	},

	sendotp(mailOptions, sendOTP) {
		//this function needs otp , to addres , subject.

		var emailOtpTemplate;
		if (sendOTP == true) {
			emailOtpTemplate = path.resolve("src/template/emailWithOTP.html");
		} else {
			emailOtpTemplate = path.resolve(
				"src/template/emailsuccessupdate.html"
			);
		}

		this.readHTMLFile(emailOtpTemplate, async (err, html) => {
			if (err) {
				console.log(err);
				return false;
			}
			const template = Handlebars.compile(html);
			const replacements = {
				otp: mailOptions.otp,
			};

			const htmlToSend = template(replacements);

			var sendoption = {
				from: config.commonEmail,
				to: mailOptions.to,
				subject: mailOptions.sub,
				html: htmlToSend,
			};
			this.sendMailFromNode(sendoption);
			// transporter.sendMail(sendoption, function (error, info) {
			// 	if (error) {
			// 		console.log("send mail error : " + error.message);
			// 	} else {
			// 		console.log("Email sent: " + info.response);
			// 	}
			// });
		});
	},

	readHTMLFile(path, callback) {
		fs.readFile(
			path,
			{
				encoding: "utf-8",
			},
			(err, html) => {
				if (err) {
					console.log(err);
					callback(err);
				} else {
					console.log(html);
					callback(null, html);
				}
			}
		);
	},

	initialUserRecords() {
		console.log("initail tecord is called");

		cron.schedule("0 20 13 * * sat", () => {
			this.getWeekelyAttendanceSummary();
			console.log("running a task at 3:30 on Sunday and Tuesday");
		});

		cron.schedule("0 30 01 * * *", () => {
			this.workFromHomeResuce();
			//this.scheduleNotification()
			//this.scheduleNotification()
		});
		cron.schedule("0 30 03 * * *", () => {
			this.scheduleNotification();
			//this.scheduleNotification()
		});
		//this.scheduleNotification()
		cron.schedule("0 30 02 * * *", () => {
			users
				.findAll({
					where: {
						isActive: true,
					},
					// include: [users]
				})
				.then((userData) => {
					let userArray = [];
					userData.forEach((obj) => {
						var TodayDate = moment().format("DD-MM");

						if (obj.dataValues.DOB.includes(TodayDate)) {
							const maildata = {
								wishesTxt:
									"Wishing you a very happy birthday full of beautiful surprises and joyous moments.",
								to: obj.dataValues.email,
								sub: "Birthday Wishes",
							};
							this.sendWishesMail(maildata);
							console.log("obj", obj.dataValues.fcmToken);
							if (!obj.dataValues.fcmToken) {
								console.log("fcm token not available");
							} else {
								if (obj.dataValues.id != 1) {
									notificationService.singlepushnotification(
										obj.dataValues.email,
										"Wishing you a very happy birthday full of beautiful surprises and joyous moments."
									);
								}
							}
						}
					});
				})
				.catch((err) => {
					console.log(err.message);
				});
		});

		fs.readFile(
			config.uploadPath + "/config/initialRecords.json",
			(err, data) => {
				if (data) {
					const initialRecords = JSON.parse(data);
					console.log("initial records are ", initialRecords);
					Object.keys(initialRecords).forEach(async (tableName) => {
						if (tableName == "users" || tableName == "positions") {
							_.forEach(
								initialRecords[tableName],
								async (records) => {
									try {
										await this.createInitialRecord(
											tableName,
											records
										);
									} catch (err) {
										console.error(
											"Initial Record Error",
											err
										);
									}
								}
							);
						} else {
							await this.createInitialRecord(
								tableName,
								initialRecords[tableName]
							);
						}
					});
				} else {
					console.log("initial records are no data");
				}
			}
		);
	},

	async workFromHomeResuce() {
		users.findAll({}).then((allData) => {
			allData.forEach(async (userObj) => {
				//	console.log("userobj",userObj.id)

				var leaveData = await leaves.findAll({
					where: {
						userId: userObj.id,
					},
				});
				var isSendNotification = true;

				if (leaveData.length != 0) {
					leaveData.forEach((leaveObj) => {
						var TodayDate = moment()
							.format("DD-MM-YYYY")
							.toString();

						var endday = leaveObj.dataValues.toDate
							.toString()
							.substr(0, 2);
						var endMonth = leaveObj.dataValues.toDate
							.toString()
							.substr(3, 2);
						var endYear = leaveObj.dataValues.toDate
							.toString()
							.substr(6, 4);
						var endDate = new Date(
							parseInt(endYear),
							parseInt(endMonth) - 1,
							parseInt(endday)
						);
						endDate = Date.parse(endDate);

						var fromDay = leaveObj.dataValues.fromDate
							.toString()
							.substr(0, 2);
						var fromMonth = leaveObj.dataValues.fromDate
							.toString()
							.substr(3, 2);
						var fromYear = leaveObj.dataValues.fromDate
							.toString()
							.substr(6, 4);
						var startDate = new Date(
							parseInt(fromYear),
							parseInt(fromMonth) - 1,
							parseInt(fromDay)
						);
						startDate = Date.parse(startDate);

						var todayDay = TodayDate.toString().substr(0, 2);
						var todayMonth = TodayDate.toString().substr(3, 2);
						var todayYear = TodayDate.toString().substr(6, 4);

						var todayparseDate = new Date(
							parseInt(todayYear),
							parseInt(todayMonth) - 1,
							parseInt(todayDay)
						);

						todayparseDate = Date.parse(todayparseDate);

						var previousDate = new Date(
							parseInt(todayYear),
							parseInt(todayMonth) - 1,
							parseInt(todayDay) - 1
						);
						previousDate = Date.parse(previousDate);

						console.log("today parse date", moment(todayparseDate));
						console.log(
							"today parse start date",
							moment(startDate)
						);
						console.log("today parse end date", moment(endDate));
						console.log("prebvious", moment(previousDate));
						if (
							previousDate <= endDate &&
							previousDate >= startDate
						) {
							if (
								leaveObj.dataValues.request ==
									"Work from Home" &&
								leaveObj.dataValues.status == "approved"
							) {
								// console.log("leaveObj.dataValues.userId",leaveObj.dataValues.userId,)
								// console.log("previous date",moment(previousDate).format('DD-MM-YYYY'))
								// console.log("today date",moment(todayparseDate).format('DD-MM-YYYY'))
								//attendanceController.resqueTimeNormalFunction(leaveObj.dataValues.userId,moment(previousDate).format('YYYY-MM-DD'),moment(previousDate).format('DD-MM-YYYY'),moment(todayparseDate).format('DD-MM-YYYY'))
								//console.log("work from home")
							}
						}
					});
				}
			});
		});
	},

	async scheduleNotification() {
		users
			.findAll({
				where: {
					isActive: true,
				},
			})
			.then((allData) => {
				allData.forEach(async (userObj) => {
					//	console.log("userobj",userObj.id)

					var leaveData = await leaves.findAll({
						where: {
							userId: userObj.id,
						},
					});
					var isSendNotification = true;

					if (leaveData.length != 0) {
						leaveData.forEach((leaveObj) => {
							var TodayDate = moment()
								.format("DD-MM-YYYY")
								.toString();

							console.log(TodayDate);
							var endday = leaveObj.dataValues.toDate
								.toString()
								.substr(0, 2);
							var endMonth = leaveObj.dataValues.toDate
								.toString()
								.substr(3, 2);
							var endYear = leaveObj.dataValues.toDate
								.toString()
								.substr(6, 4);
							var endDate = new Date(
								parseInt(endYear),
								parseInt(endMonth) - 1,
								parseInt(endday)
							);
							endDate = Date.parse(endDate);

							var fromDay = leaveObj.dataValues.fromDate
								.toString()
								.substr(0, 2);
							var fromMonth = leaveObj.dataValues.fromDate
								.toString()
								.substr(3, 2);
							var fromYear = leaveObj.dataValues.fromDate
								.toString()
								.substr(6, 4);
							var startDate = new Date(
								parseInt(fromYear),
								parseInt(fromMonth) - 1,
								parseInt(fromDay)
							);
							startDate = Date.parse(startDate);

							var todayDay = TodayDate.toString().substr(0, 2);
							var todayMonth = TodayDate.toString().substr(3, 2);
							var todayYear = TodayDate.toString().substr(6, 4);

							var todayparseDate = new Date(
								parseInt(todayYear),
								parseInt(todayMonth) - 1,
								parseInt(todayDay)
							);
							todayparseDate = Date.parse(todayparseDate);

							if (
								todayparseDate <= endDate &&
								todayparseDate >= startDate
							) {
								if (
									leaveObj.dataValues.request == "Full Day" ||
									leaveObj.dataValues.request ==
										"Work from Home"
								) {
									isSendNotification = false;
								} else {
									var date = moment().format("dddd");

									if (
										date != "Saturday" &&
										date !== "Sunday"
									) {
										if (!userObj.dataValues.fcmToken) {
											isSendNotification = false;
										} else {
											isSendNotification = true;
										}
									} else {
										isSendNotification = false;
									}
								}
							} else {
								var date = moment().format("dddd");

								if (date != "Saturday" && date !== "Sunday") {
									if (!userObj.dataValues.fcmToken) {
										isSendNotification = false;
									} else {
										isSendNotification = true;
									}
								} else {
									isSendNotification = false;
								}
							}
						});
					}

					if (isSendNotification == true) {
						var date = moment().format("dddd");

						if (date != "Saturday" && date !== "Sunday") {
							console.log("userobj", userObj.id);
							if (userObj.id != 1) {
								notificationService.singlepushnotification(
									userObj.email,
									"Hi,Connect with us by scan."
								);
							}
						}
					}
				});
			});
	},

	async addLeadingZeros(num, totalLength) {
		return String(num).padStart(totalLength, "0");
	},
	async getWeekelyAttendanceSummary() {
		console.log("weekly summary called");
		var date = new Date();
		var day = date.getDay();
		var prevMonday = new Date();
		if (date.getDay() == 0) {
			prevMonday.setDate(date.getDate() - 7);
		} else {
			prevMonday.setDate(date.getDate() - (day - 1));
		}

		var monday = prevMonday;

		const today = new Date();
		const first = today.getDate() - today.getDay() + 1;
		const fifth = first + 4;

		const friday = new Date(today.setDate(fifth));

		const fridayForMail = new Date(today.setDate(fifth));

		var mondayFormated = moment(monday).format("YYYY-MM-DD");
		var fridayFormated = moment(friday).format("YYYY-MM-DD");

		var mailMondayFromated = moment(monday).format("DD-MM-YYYY");
		var mailFridayFromated = moment(fridayForMail).format("DD-MM-YYYY");

		var mailFullMondayFormated = moment(monday).format("DD-MMM-YYYY");
		var mailFullFridayFromated =
			moment(fridayForMail).format("DD-MMM-YYYY");
		console.log("monday ", mondayFormated);
		console.log("fridayFormated ", fridayFormated);

		var userAttendanceData = [];
		await users
			.findAll({
				where: {
					email: {
						$notIn: ["stevej.india@gmail.com"],
					},

					onshore: false,
					isActive: true,
				},

				attributes: {
					exclude: ["password", "userOtp"],
				},
				include: [
					{
						model: attendances,
						where: {
							attendanceDate: {
								$between: [mondayFormated, fridayFormated],
							},
						},
					},
				],
			})
			.then(async (userData) => {
				userAttendanceData = userData;
				userData.forEach(async (userSingleObj, index) => {
					let leavesData = await leaves.findAll({
						where: {
							fromDateFormat: {
								$between: [mondayFormated, fridayFormated],
							},
							userId: userSingleObj.id,
						},
					});

					console.log("leavesDataArray", leavesData);

					var fulldayCount = 0;
					var halfdayCount = 0;
					var fulldayLeaveHours = 0;
					var halfdayLeaveHours = 0;
					var permissionHours = 0.0;
					var permissionCount = 0;
					var workFromHomHours = 0;
					var workFromHomeHoursCount = 0;
					for (let index = 0; index < leavesData.length; index++) {
						console.log("obj", leavesData[index]);
						if (leavesData[index].request === "Full Day") {
							fulldayCount = fulldayCount + 1;
							fulldayLeaveHours = fulldayLeaveHours + 8;
							//fulldayLeaveHours = fulldayLeaveHours.toFixed(2)
						} else if (leavesData[index].request === "Half Day") {
							halfdayCount = halfdayCount + 1;
							halfdayLeaveHours = halfdayLeaveHours + 4;
							//halfdayLeaveHours = halfdayLeaveHours.toFixed(2)
						} else if (leavesData[index].request === "Permission") {
							permissionCount = permissionCount + 1;
							// let companyData = await companies.findOne({

							// 	where : {
							// 		id : userSingleObj.companyId
							// 	}
							// })

							// if(leavesData[index].permission.includes("AM"))
							// {
							// 	console.log("am containts")

							// 	var permissionDiff = this.diffTime(this.convertTimeFrom12To24(companyData.regularWorkIn),this.convertTimeFrom12To24(leavesData[index].permission))

							// 	console.log("perm",permissionDiff)
							// 	var permissionMinutes = permissionDiff[1]/60
							// 	var permissionHoursValue = permissionDiff[0] + permissionMinutes
							// 	console.log("permissionHoursValue",permissionHoursValue)
							// 	permissionHours = permissionHours + permissionHoursValue

							// }
							// else if(leavesData[index].permission.includes("PM")){
							// 	console.log("pm contains")
							// 	// var d1 = Date.parse(leavesData[index].permission);
							// 	// var d2 = Date.parse(companyData.regularWorkOut);

							// 	var permissionDiff = this.diffTime(this.convertTimeFrom12To24(leavesData[index].permission),this.convertTimeFrom12To24(companyData.regularWorkOut))

							// 	console.log("perm",permissionDiff)
							// 	var permissionMinutes = permissionDiff[1]/60
							// 	var permissionHoursValue = permissionDiff[0] + permissionMinutes
							// 	console.log("permissionHoursValue",permissionHoursValue)
							// 	permissionHours = permissionHours + permissionHoursValue

							// }
							// let permissionTime = leavesData[index].permission
							// console.log("permission time",permissionTime)
							// console.log("comapny data",companyData.regularWorkOut)
						} else if (
							leavesData[index].request === "Work from Home"
						) {
							workFromHomeHoursCount = workFromHomeHoursCount + 1;
						}
					}
					var response = {};
					response.halfdayCount = halfdayCount;
					response.fulldayCount = fulldayCount;
					response.fulldayLeaveHours = fulldayLeaveHours;
					response.halfdayLeaveHours = halfdayLeaveHours;
					let attendance = [];

					let overAllWorkingMins = 0;
					let overAllBreakMins = 0;
					let mailTable2 =
						'<table style="width: 600px;margin: 0 auto;min-width: 600px;background: #f9f9f9;padding: 26px 20px 50px;font-family: arial;border-radius:4px;"cellpadding = "0" cellspacing = "0"><tbody><tr><td style="width: 100%;text-align: center;padding-bottom: 40px;"><div><img src="https://www.greatinnovus.com/blogs/wp-content/uploads/2022/01/GI_newcolor.png" width="225" style="padding-top: 10px;"></div></td></tr><tr><td><table style="width: 100%;margin-bottom: 15px;"><tr><td style="width: 407px;"><div><b style="float: left;padding-right: 6px;">Name :</b><div>' +
						userSingleObj.userName +
						'</div></div></td><td><div><b style="float: left;padding-right: 6px;">Employee ID :</b><div>' +
						userSingleObj.employeeId +
						'</div></div></td></tr></table></td> </tr><tr><td><table style="width: 100%;margin-bottom: 15px;"><tr><td><div><b style="float: left;padding-right: 6px;">Report Date :</b><div>' +
						mailFullMondayFormated +
						" to " +
						mailFullFridayFromated +
						'</div></div></td></tr></table></td></tr><tr><td><table style="width:100%;"><tr><td><table style="width:100%;border-collapse: collapse;border: 1px solid;"><tr><th style="border: 1px solid #000;padding: 2px 6px;background: #5ca529;color: #fff;font-weight: normal;">Day</th><th style="border: 1px solid #000;padding: 2px 6px;background: #5ca529;color: #fff;font-weight: normal;">Work Hours</th> <th style="border: 1px solid #000;padding: 2px 6px;background: #5ca529;color: #fff;font-weight: normal;">Break Hours</th><th style="border: 1px solid #000;padding: 2px 6px;background: #5ca529;color: #fff;font-weight: normal;">Status</th><th style="border: 1px solid #000;padding: 2px 6px;background: #5ca529;color: #fff;font-weight: normal;">Work Form</th></tr>';
					let mailTable =
						userSingleObj.email +
						" " +
						userSingleObj.employeeId +
						" " +
						"<table><TABLE BORDER=”2″><thead><td><b>Day</b></td><td><b>Work Hours</b></td><td><b>Break Hours</b></td></thead>";

					for (
						let index = 0;
						index < userSingleObj.attendances.length;
						index++
					) {
						var presentStatus = "Present";
						for (
							let subIndex = 0;
							subIndex < leavesData.length;
							subIndex++
						) {
							if (
								userSingleObj.attendances[index]
									.attendanceDate >=
									leavesData[subIndex].fromDateFormat &&
								userSingleObj.attendances[index]
									.attendanceDate <=
									leavesData[subIndex].toDateFormat
							) {
								if (leavesData[index].request === "Half Day") {
									presentStatus = "Present + H";
								} else if (
									leavesData[index].request === "Permission"
								) {
									presentStatus = "Present + P";
								}
							}
						}
						let attendanceObj = userSingleObj.attendances[index];
						let convertedMins = parseInt(
							moment
								.duration(attendanceObj.totalHours)
								.asMinutes()
						);

						overAllWorkingMins += convertedMins;

						if (attendanceObj.attendanceType === "Work from Home") {
							workFromHomHours += convertedMins;
						}

						var statusColor = "green";

						if (convertedMins >= 600) {
							statusColor = "orange";
						} else if (convertedMins < 480) {
							statusColor = "red";
						}
						mailTable +=
							'<tr><td style="background-color:red">' +
							attendanceObj.dateOfAttendance +
							"</td><td>" +
							attendanceObj.totalHours +
							"</td><td>" +
							attendanceObj.totalBreakHours +
							"</td></tr>";
						let convertedBreakMins = parseInt(
							moment
								.duration(attendanceObj.totalBreakHours)
								.asMinutes()
						);
						overAllBreakMins += convertedBreakMins;
						var breakStatusColor = "";
						if (convertedBreakMins < 60) {
							breakStatusColor = "red";
						}
						attendance.push({
							date: attendanceObj.dateOfAttendance,
							workHours: attendanceObj.totalHours,
							breakHours: attendanceObj.totalBreakHours,
							status: presentStatus,
							statusColor: statusColor,
							breakStatusColor: breakStatusColor,
							workFrom:
								attendanceObj.attendanceType == "QR"
									? "Office"
									: "Home",
						});
					}

					let mondayFormatedCount = new Date(
						mondayFormated
					).getDate();

					let mondayMonthFormated = new Date(
						mondayFormated
					).getMonth();
					let mondayFormatedYear = new Date(
						mondayFormated
					).getFullYear();

					let fridayFormatedDate = new Date(fridayFormated).getDate();

					for (
						let index = mondayFormatedCount;
						index <= fridayFormatedDate;
						index++
					) {
						let date = new Date(
							mondayFormatedYear,
							mondayMonthFormated,
							mondayFormatedCount
						);
						let formatedDate = moment(date).format("DD-MM-YYYY");

						console.log("formatedDate", formatedDate);
						const filteredAttendance = attendance.filter(
							(val) => val.date === formatedDate
						);

						console.log(
							"filteredAttendance",
							filteredAttendance.length
						);

						if (filteredAttendance.length == 0) {
							attendance.push({
								date: formatedDate,
								workHours: "-",
								breakHours: "-",
								status: "Leave",
								statusColor: "",
								breakStatusColor: "-",
								workFrom: "-",
							});
						}
						mondayFormatedCount = mondayFormatedCount + 1;
					}
					attendance.sort(function (a, b) {
						var keyA = a.date,
							keyB = b.date;
						console.log(keyA, keyB);
						// Compare the 2 dates
						if (keyA < keyB) return -1;
						if (keyA > keyB) return 1;
						return 0;
					});

					for (let index = 0; index < attendance.length; index++) {
						if (attendance[index].statusColor == "red") {
							console.log("reddcalled");
							if (attendance[index].breakStatusColor == "red") {
								mailTable2 +=
									'<tr><td style="border: 1px solid;padding: 2px 6px;text-align: center;">' +
									attendance[index].date +
									'</td><td style="border: 1px solid;padding: 2px 6px;background-color:red;color:white;text-align: center;">' +
									attendance[index].workHours +
									'</td><td style="border: 1px solid;padding: 2px 6px;text-align: center;background-color:red;color:white;text-align: center;">' +
									attendance[index].breakHours +
									'</td><td style="border: 1px solid;padding: 2px 6px;">' +
									attendance[index].status +
									'</td><td style="border: 1px solid;padding: 2px 6px;">' +
									attendance[index].workFrom +
									"</td></tr>";
							} else {
								mailTable2 +=
									'<tr><td style="border: 1px solid;padding: 2px 6px;text-align: center;">' +
									attendance[index].date +
									'</td><td style="border: 1px solid;padding: 2px 6px;background-color:red;color:white;text-align: center;">' +
									attendance[index].workHours +
									'</td><td style="border: 1px solid;padding: 2px 6px;text-align: center;">' +
									attendance[index].breakHours +
									'</td><td style="border: 1px solid;padding: 2px 6px;">' +
									attendance[index].status +
									'</td><td style="border: 1px solid;padding: 2px 6px;">' +
									attendance[index].workFrom +
									"</td></tr>";
							}
						} else if (attendance[index].statusColor == "orange") {
							if (attendance[index].breakStatusColor == "red") {
								mailTable2 +=
									'<tr><td style="border: 1px solid;padding: 2px 6px;text-align: center;">' +
									attendance[index].date +
									'</td><td style="border: 1px solid;padding: 2px 6px;background-color:orange;color:white;text-align: center;">' +
									attendance[index].workHours +
									'</td><td style="border: 1px solid;padding: 2px 6px;text-align: center;background-color:red;color:white;text-align: center;">' +
									attendance[index].breakHours +
									'</td><td style="border: 1px solid;padding: 2px 6px;">' +
									attendance[index].status +
									'</td><td style="border: 1px solid;padding: 2px 6px;">' +
									attendance[index].workFrom +
									"</td></tr>";
							} else {
								mailTable2 +=
									'<tr><td style="border: 1px solid;padding: 2px 6px;text-align: center;">' +
									attendance[index].date +
									'</td><td style="border: 1px solid;padding: 2px 6px;background-color:orange;color:white;text-align: center;">' +
									attendance[index].workHours +
									'</td><td style="border: 1px solid;padding: 2px 6px;text-align: center;">' +
									attendance[index].breakHours +
									'</td><td style="border: 1px solid;padding: 2px 6px;">' +
									attendance[index].status +
									'</td><td style="border: 1px solid;padding: 2px 6px;">' +
									attendance[index].workFrom +
									"</td></tr>";
							}
						} else {
							if (attendance[index].breakStatusColor == "red") {
								mailTable2 +=
									'<tr><td style="border: 1px solid;padding: 2px 6px;text-align: center;">' +
									attendance[index].date +
									'</td><td style="border: 1px solid;padding: 2px 6px;text-align: center;">' +
									attendance[index].workHours +
									'</td><td style="border: 1px solid;padding: 2px 6px;text-align: center;background-color:red;color:white;text-align: center;">' +
									attendance[index].breakHours +
									'</td><td style="border: 1px solid;padding: 2px 6px;">' +
									attendance[index].status +
									'</td><td style="border: 1px solid;padding: 2px 6px;">' +
									attendance[index].workFrom +
									"</td></tr>";
							} else {
								mailTable2 +=
									'<tr><td style="border: 1px solid;padding: 2px 6px;text-align: center;">' +
									attendance[index].date +
									'</td><td style="border: 1px solid;padding: 2px 6px;text-align: center;">' +
									attendance[index].workHours +
									'</td><td style="border: 1px solid;padding: 2px 6px;text-align: center;">' +
									attendance[index].breakHours +
									'</td><td style="border: 1px solid;padding: 2px 6px;">' +
									attendance[index].status +
									'</td><td style="border: 1px solid;padding: 2px 6px;">' +
									attendance[index].workFrom +
									"</td></tr>";
							}
						}

						//	mailTable2 += '<tr><td style="border: 1px solid;padding: 2px 6px;text-align: center;">' + attendance[index].date  + '</td><td style="border: 1px solid;padding: 2px 6px;">'+ attendance[index].workHours +'</td><td style="border: 1px solid;padding: 2px 6px;">'+ attendance[index].breakHours   +'</td><td style="border: 1px solid;padding: 2px 6px;">'+  attendance[index].status   +'</td><td style="border: 1px solid;padding: 2px 6px;">'+ attendance[index].workFrom +'</td></tr>'
					}
					mailTable2 += "</table></td></tr></table></td></tr>";

					let workbook = new excel.Workbook();
					let worksheet = workbook.addWorksheet("Attendance");
					// worksheet.mergeCells('A1', 'D2');
					worksheet.getCell("A1").value =
						"Name: " + userSingleObj.userName;
					worksheet.getCell("D1").value =
						"Employee ID: " + userSingleObj.employeeId;
					worksheet.getCell("A3").value =
						"Report Date: " +
						mailMondayFromated +
						" to " +
						mailFridayFromated;
					worksheet.getRow(1).font = { bold: true };

					worksheet.getRow(4);
					worksheet.getRow(4).font = {
						color: { argb: "FFFFFF" },
						bold: true,
					};
					// worksheet.getRow(4).fill = {  patternType: "solid",
					// fgColor: { rgb: "6d9eeb" }};
					worksheet.getRow(4).values = [
						"Day",
						"Work Hours",
						"Break Hours",
						"workFrom",
					];
					worksheet.columns = [
						{
							key: "date",
							width: 25,
						},
						{
							key: "workHours",
							width: 25,
						},
						{
							key: "breakHours",
							width: 25,
						},
						{
							key: "workFrom",
							width: 25,
						},
					];
					worksheet.addRows(attendance);

					worksheet.eachRow((row, rowNumber) => {
						row.eachCell((cell, colNumber) => {
							if (rowNumber == 4) {
								// First set the background of header row
								cell.fill = {
									type: "pattern",
									pattern: "solid",
									fgColor: { argb: "6d9eeb" },
								};
							}
							if (
								(rowNumber > 4 && colNumber == 3) ||
								(rowNumber > 4 && colNumber == 4) ||
								(rowNumber > 4 && colNumber == 2) ||
								(rowNumber > 4 && colNumber == 1)
							) {
								cell.font = {
									bold: true,
								};
							}
							// Set border of each cell
							cell.border = {
								top: { style: "thin" },
								left: { style: "thin" },
								bottom: { style: "thin" },
								right: { style: "thin" },
							};
						});
						//Commit the changed row to the stream
						row.commit();
					});
					const buffer = await workbook.xlsx.writeBuffer();
					mailTable += "</table>";

					console.log(
						"weekely work hours",
						userSingleObj.email,
						overAllWorkingMins
					);
					//console.log("mailtable", mailTable)

					var fulldayHoursInFloat = fulldayLeaveHours.toFixed(2);
					var halfdayHoursInFloat = halfdayLeaveHours.toFixed(2);
					var fullDays =
						fulldayCount > 0
							? `${fulldayCount} Days`
							: `${fulldayCount} Day`;
					var halfdays =
						halfdayCount > 0
							? `${halfdayCount} Days`
							: `${halfdayCount} Day`;
					var workFromDays =
						workFromHomeHoursCount > 0
							? `${workFromHomeHoursCount} Days`
							: `${workFromHomeHoursCount} Day`;
					if (overAllWorkingMins > 0) {
						var minutes = overAllWorkingMins % 60;
						var hours = (overAllWorkingMins - minutes) / 60;
						var convertedTotalHrs =
							(hours < 10 ? "0" : "") +
							hours +
							":" +
							(minutes < 10 ? "0" + minutes : minutes);

						var break_minutes = overAllBreakMins % 60;
						var break_hours =
							(overAllBreakMins - break_minutes) / 60;
						var convertedBreakHours =
							(break_hours < 10 ? "0" : "") +
							break_hours +
							":" +
							(break_minutes < 10
								? "0" + break_minutes
								: break_minutes);

						var convertedWorkFromHours = "0:00";
						if (workFromHomHours > 0) {
							var work_from_minutes = workFromHomHours % 60;
							var work_from_hours =
								(workFromHomHours - work_from_minutes) / 60;
							convertedWorkFromHours =
								(work_from_hours < 10 ? "0" : "") +
								work_from_hours +
								":" +
								(work_from_minutes < 10
									? "0" + work_from_minutes
									: work_from_minutes);
						}
						console.log("workFromHomHours", workFromHomHours);

						var halfDayHoursLeadingStr = halfdayHoursInFloat;
						var fullDayHoursLeadingStr = fulldayHoursInFloat;
						if (halfdayHoursInFloat < 10.0) {
							halfDayHoursLeadingStr = "0" + halfdayHoursInFloat;
						}
						if (fulldayHoursInFloat < 10.0) {
							fullDayHoursLeadingStr = "0" + fulldayHoursInFloat;
						}

						mailTable2 +=
							'<tr><td><table style="width:100%;margin-top: 20px;"><tr><td><div style="font-weight: bold;padding-bottom:10px">Summary</div>';
						mailTable2 +=
							'<div style="padding-bottom:10px;display:block;padding-bottom:12px;height: 14px;"><div style="float: left;width:140px">Actual hours</div><div style="float: left;font-weight: bold;">: 40:00</div></div>';
						mailTable2 +=
							'<div style="margin-bottom:10px;display: block;height: 14px;clear: both;"><div style="float: left;width:140px">Work hours</div><div style="float: left;font-weight: bold;">: ' +
							convertedTotalHrs +
							"</div></div>";
						mailTable2 +=
							'<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Break hours</div><div style="float: left;">: ' +
							convertedBreakHours +
							"</div></div>";
						mailTable2 +=
							'<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Full Leave hours</div><div style="float: left;">: ' +
							fullDayHoursLeadingStr +
							"( " +
							fullDays +
							" )" +
							"</div></div>";
						mailTable2 +=
							'<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Half Day Leave hours</div><div style="float: left;">: ' +
							halfDayHoursLeadingStr +
							"( " +
							halfdays +
							" )" +
							"</div></div>";
						mailTable2 +=
							'<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Permission Count</div><div style="float: left;">: ' +
							permissionCount +
							"</div></div>";
						mailTable2 +=
							'<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Work from home hours</div><div style="float: left;">: ' +
							convertedWorkFromHours +
							"( " +
							workFromDays +
							" )" +
							"</div></div>";

						mailTable += "Actual  Hours : <b> 40:00</b>" + "<br>";
						mailTable +=
							"Total Work Hours : <b>" +
							convertedTotalHrs +
							"</b><br>";
						mailTable +=
							"Total Break Hours : <b>" +
							convertedBreakHours +
							"</b><br>";
						mailTable +=
							"Full day Leave hours : <b>" +
							fulldayLeaveHours +
							"( " +
							fulldayCount +
							") Days" +
							"</b><br>";
						mailTable +=
							"Half day leave hours : <b>" +
							halfdayLeaveHours +
							"( " +
							halfdayCount +
							") Days" +
							"</b><br>";

						mailTable +=
							"Permission Hours : <b>" +
							permissionHours +
							"( " +
							permissionCount +
							") Days" +
							"</b><br>";
						mailTable +=
							"Work From Home Hours : <b>" +
							convertedWorkFromHours +
							"( " +
							workFromHomeHoursCount +
							") Days" +
							"</b><br>";
					} else {
						var convertedWorkFromHours = "0:00";
						if (workFromHomHours > 0) {
							var work_from_minutes = workFromHomHours % 60;
							var work_from_hours =
								(overAllBreakMins - work_from_minutes) / 60;
							convertedWorkFromHours =
								work_from_hours +
								":" +
								(work_from_minutes < 10
									? "0" + work_from_minutes
									: work_from_minutes);
						}

						var halfDayHoursLeadingStr = halfdayHoursInFloat;
						var fullDayHoursLeadingStr = fulldayHoursInFloat;
						if (halfdayHoursInFloat < 10.0) {
							halfDayHoursLeadingStr = "0" + halfdayHoursInFloat;
						}
						if (fulldayHoursInFloat < 10.0) {
							fullDayHoursLeadingStr = "0" + fulldayHoursInFloat;
						}
						mailTable2 +=
							'<tr><td><table style="width:100%;margin-top: 20px;"><tr><td><div style="font-weight: bold;padding-bottom:10px">Summary</div>';
						mailTable2 +=
							'<div style="padding-bottom:10px;display:block;padding-bottom:12px;height: 14px;"><div style="float: left;width:140px">Actual hours</div><div style="float: left;font-weight: bold;">: 40:00</div></div>';
						mailTable2 +=
							'<div style="margin-bottom:10px;display: block;height: 14px;clear: both;"><div style="float: left;width:140px">Work hours</div><div style="float: left;font-weight: bold;">: ' +
							"0.00" +
							"</div></div>";
						mailTable2 +=
							'<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Break hours</div><div style="float: left;">: ' +
							"0.00" +
							"</div></div>";
						mailTable2 +=
							'<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Full Leave hours</div><div style="float: left;">: ' +
							fullDayHoursLeadingStr +
							"( " +
							fullDays +
							" )" +
							"</div></div>";
						mailTable2 +=
							'<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Half Day Leave hours</div><div style="float: left;">: ' +
							halfDayHoursLeadingStr +
							"( " +
							halfdays +
							" )" +
							"</div></div>";
						mailTable2 +=
							'<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Permission Count</div><div style="float: left;">: ' +
							permissionCount +
							"</div></div>";
						mailTable2 +=
							'<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Work from home hours</div><div style="float: left;">: ' +
							convertedWorkFromHours +
							"( " +
							workFromDays +
							" )" +
							"</div></div>";
						mailTable += "Actual  Hours : <b> 40:00</b>" + "<br>";
						mailTable +=
							"Total Work Hours : <b>" + "0.00" + "</b><br>";
						mailTable +=
							"Total Break Hours : <b>" + "0.00" + "</b><br>";
						mailTable +=
							"Full day Leave hours : <b>" +
							fulldayLeaveHours +
							"( " +
							fulldayCount +
							") Days" +
							"</b><br>";
						mailTable +=
							"Half day leave hours : <b>" +
							halfdayLeaveHours +
							"( " +
							halfdayCount +
							") Days" +
							"</b><br>";

						mailTable +=
							"Permission Hours : <b>" +
							permissionHours +
							"( " +
							permissionCount +
							") Days" +
							"</b><br>";
						mailTable +=
							"Work From Home Hours : <b>" +
							convertedWorkFromHours +
							"( " +
							workFromHomeHoursCount +
							") Days" +
							"</b><br>";
					}
					console.log("mailtable", mailTable);

					mailTable2 +=
						"</td></tr></table></td></tr></tbody></table>";
					const path = `${config.uploadPath}/attendanceSummary/attendance ${userSingleObj.userName} ( ${userSingleObj.employeeId} ) - ${mailFullMondayFormated} to ${mailFullFridayFromated}.xlsx`;

					fs.createWriteStream(path).write(buffer);

					setTimeout(() => {
						this.sendWeeklyMail(
							userSingleObj.email,
							mailFullMondayFormated,
							mailFullFridayFromated,
							userSingleObj,
							buffer,
							mailTable2
						);
					}, 1000 * index);

					// var sendoption = {
					// 	from: config.commonEmail,
					// 	to: userSingleObj.email,
					// 	subject: "Weekly attendance report " + mondayFormated + ' - ' + fridayFormated,
					// 	html: mailTable,
					// 	attachments: [{

					// 		filename: `attendance ${userSingleObj.email}.xlsx`,
					// 		content: buffer,
					// 		contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
					// 	}],
					// };
					// console.log("sendoptions", sendoption)
					// this.sendMailFromNode(sendoption)
				});
			});

		this.sendMailToNonAttendanceUser(
			userAttendanceData,
			mondayFormated,
			fridayFormated,
			mailFullMondayFormated,
			mailFullFridayFromated,
			mailMondayFromated,
			mailFridayFromated
		);

		// console.log("userdataValue",userAttendanceData.length)

		// const userCurrentOBj = await users.findAll({
		// 	where:{
		// 		isActive : true
		// 	}
		// })

		// userCurrentOBj.forEach(async (userSingleObj) => {

		// 	let leavesData = await leaves.findAll({
		// 		where : {

		// 			fromDateFormat: {
		// 				$between: [mondayFormated, fridayFormated]
		// 			},
		// 			userId: userSingleObj.id
		// 		}
		// 	})

		// 	console.log("leavesDataArray",leavesData)

		// 	var fulldayCount = 0
		// 	var halfdayCount = 0
		// 	var fulldayLeaveHours = 0
		// 	var halfdayLeaveHours = 0
		// 	var permissionHours = 0.0
		// 	var permissionCount = 0
		// 	var workFromHomHours = 0
		// 	var workFromHomeHoursCount = 0
		// 	for(let index = 0 ; index < leavesData.length; index++)
		// 	{
		// 		console.log("obj",leavesData[index])
		// 		if(leavesData[index].request === "Full Day")
		// 		{
		// 			fulldayCount = fulldayCount + 1
		// 			fulldayLeaveHours = fulldayLeaveHours + 8
		// 			//fulldayLeaveHours = fulldayLeaveHours.toFixed(2)

		// 		}
		// 		else if(leavesData[index].request === "Half Day")
		// 		{
		// 			halfdayCount = halfdayCount + 1
		// 			halfdayLeaveHours = halfdayLeaveHours + 4
		// 			//halfdayLeaveHours = halfdayLeaveHours.toFixed(2)
		// 		}
		// 		else if(leavesData[index].request === "Permission")
		// 		{

		// 			permissionCount = permissionCount + 1

		// 		}
		// 		else if(leavesData[index].request === "Work from Home")
		// 		{
		// 			workFromHomeHoursCount = workFromHomeHoursCount + 1

		// 		}
		// 	}
		// 	var fullDays = fulldayCount > 0 ? `${fulldayCount} Days` : `${fulldayCount} Day`
		// 	var halfdays = halfdayCount > 0 ? `${halfdayCount} Days` : `${halfdayCount} Day`
		// 	var workFromDays= workFromHomeHoursCount > 0 ? `${workFromHomeHoursCount} Days` : `${workFromHomeHoursCount} Day`
		// 	var attendance = []
		// 	const filterObj = userAttendanceData.filter(val => val.id == userSingleObj.id)

		// 	let mailTable2 = '<table style="width: 600px;margin: 0 auto;min-width: 600px;background: #f9f9f9;padding: 26px 20px 50px;font-family: arial;border-radius:4px;"cellpadding = "0" cellspacing = "0"><tbody><tr><td style="width: 100%;text-align: center;padding-bottom: 40px;"><div><img src="https://www.greatinnovus.com/blogs/wp-content/uploads/2022/01/GI_newcolor.png" width="225" style="padding-top: 10px;"></div></td></tr><tr><td><table style="width: 100%;margin-bottom: 15px;"><tr><td style="width: 407px;"><div><b style="float: left;padding-right: 6px;">Name :</b><div>'+  userSingleObj.userName +'</div></div></td><td><div><b style="float: left;padding-right: 6px;">Employee ID :</b><div>'+ userSingleObj.employeeId +'</div></div></td></tr></table></td> </tr><tr><td><table style="width: 100%;margin-bottom: 15px;"><tr><td><div><b style="float: left;padding-right: 6px;">Report Date :</b><div>'+ mailFullMondayFormated + ' to ' + mailFullFridayFromated + '</div></div></td></tr></table></td></tr><tr><td><table style="width:100%;"><tr><td><table style="width:100%;border-collapse: collapse;border: 1px solid;"><tr><th style="border: 1px solid #000;padding: 2px 6px;background: #5ca529;color: #fff;font-weight: normal;">Day</th><th style="border: 1px solid #000;padding: 2px 6px;background: #5ca529;color: #fff;font-weight: normal;">Work Hours</th> <th style="border: 1px solid #000;padding: 2px 6px;background: #5ca529;color: #fff;font-weight: normal;">Break Hours</th><th style="border: 1px solid #000;padding: 2px 6px;background: #5ca529;color: #fff;font-weight: normal;">Status</th><th style="border: 1px solid #000;padding: 2px 6px;background: #5ca529;color: #fff;font-weight: normal;">Work Form</th></tr>'
		// 	if(filterObj.length == 0)
		// 	{
		// 		let mondayFormatedCount = new Date(mondayFormated).getDate()

		// 		let mondayMonthFormated = new Date(mondayFormated).getMonth()
		// 		let mondayFormatedYear = new Date(mondayFormated).getFullYear()

		// 		let fridayFormatedDate = new  Date(fridayFormated).getDate()
		// 		for(let index = mondayFormatedCount ; index <= fridayFormatedDate ; index++)
		// 		{

		// 			let date = new Date(mondayFormatedYear,mondayMonthFormated,mondayFormatedCount)
		// 			let formatedDate = moment(date).format('DD-MM-YYYY')

		// 			let FormatDateWithYY =   moment(date).format('YYYY-MM-DD')

		// 			var presentStatus = 'Absent'
		// 			for (let subIndex = 0; subIndex < leavesData.length; subIndex++) {
		// 				if (FormatDateWithYY >= leavesData[subIndex].fromDateFormat && FormatDateWithYY <= leavesData[subIndex].toDateFormat) {

		// 					console.log("called inside")
		// 					presentStatus = 'Leave'
		// 				}

		// 			}
		// 			attendance.push({

		// 				date: formatedDate,
		// 				workHours: "-",
		// 				breakHours: "-",
		// 				status : presentStatus,
		// 				statusColor:'',
		// 				breakStatusColor : '-',
		// 				workFrom : "-"

		// 			});
		// 			mondayFormatedCount = mondayFormatedCount + 1

		// 		}

		// 		for(let index = 0; index < attendance.length ; index++)
		// 		  {

		// 		mailTable2 += '<tr><td style="border: 1px solid;padding: 2px 6px;text-align: center;">' + attendance[index].date + '</td><td style="border: 1px solid;padding: 2px 6px;text-align: center;">' + attendance[index].workHours + '</td><td style="border: 1px solid;padding: 2px 6px;text-align: center;text-align: center;">' + attendance[index].breakHours + '</td><td style="border: 1px solid;padding: 2px 6px;">' + attendance[index].status + '</td><td style="border: 1px solid;padding: 2px 6px;">' + attendance[index].workFrom + '</td></tr>'

		// 		//	mailTable2 += '<tr><td style="border: 1px solid;padding: 2px 6px;text-align: center;">' + attendance[index].date  + '</td><td style="border: 1px solid;padding: 2px 6px;">'+ attendance[index].workHours +'</td><td style="border: 1px solid;padding: 2px 6px;">'+ attendance[index].breakHours   +'</td><td style="border: 1px solid;padding: 2px 6px;">'+  attendance[index].status   +'</td><td style="border: 1px solid;padding: 2px 6px;">'+ attendance[index].workFrom +'</td></tr>'
		// 		  }
		// 		  mailTable2 += '</table></td></tr></table></td></tr>'

		// 		  let workbook = new excel.Workbook();
		// 		  let worksheet = workbook.addWorksheet("Attendance");
		// 		  // worksheet.mergeCells('A1', 'D2');
		// 		  worksheet.getCell('A1').value = "Name: " + userSingleObj.userName
		// 		  worksheet.getCell('D1').value = "Employee ID: " + userSingleObj.employeeId
		// 		  worksheet.getCell('A3').value = "Report Date: " + mailMondayFromated + " to " + mailFridayFromated
		// 		  worksheet.getRow(1).font = { bold: true };

		// 		  worksheet.getRow(4)
		// 		  worksheet.getRow(4).font = { color: { argb: "FFFFFF" }, bold: true, };
		// 		  // worksheet.getRow(4).fill = {  patternType: "solid",
		// 		  // fgColor: { rgb: "6d9eeb" }};
		// 		  worksheet.getRow(4).values = ['Day', 'Work Hours', 'Break Hours', 'workFrom'];
		// 		  worksheet.columns = [
		// 			  {

		// 				  key: "date",
		// 				  width: 25,
		// 			  },
		// 			  {

		// 				  key: "workHours",
		// 				  width: 25,
		// 			  },
		// 			  {

		// 				  key: "breakHours",
		// 				  width: 25,
		// 			  },
		// 			  {

		// 				  key: "workFrom",
		// 				  width: 25,
		// 			  },

		// 		  ];
		// 		  worksheet.addRows(attendance);

		// 		  worksheet.eachRow((row, rowNumber) => {

		// 			  row.eachCell((cell, colNumber) => {
		// 				  if (rowNumber == 4) {
		// 					  // First set the background of header row
		// 					  cell.fill = {
		// 						  type: 'pattern',
		// 						  pattern: 'solid',
		// 						  fgColor: { argb: '6d9eeb' }
		// 					  };
		// 				  };
		// 				  if (rowNumber > 4 && colNumber == 3 || rowNumber > 4 && colNumber == 4 || rowNumber > 4 && colNumber == 2 || rowNumber > 4 && colNumber == 1) {
		// 					cell.font = {
		// 						bold: true
		// 					}
		// 				}
		// 				  // Set border of each cell
		// 				  cell.border = {
		// 					  top: { style: 'thin' },
		// 					  left: { style: 'thin' },
		// 					  bottom: { style: 'thin' },
		// 					  right: { style: 'thin' }
		// 				  };
		// 			  })
		// 			  //Commit the changed row to the stream
		// 			  row.commit();
		// 		  });
		// 		const buffer = await workbook.xlsx.writeBuffer();
		// 		var fulldayHoursInFloat = fulldayLeaveHours.toFixed(2)
		// 		var halfdayHoursInFloat = halfdayLeaveHours.toFixed(2)
		// 		var halfDayHoursLeadingStr = halfdayHoursInFloat
		// 		var fullDayHoursLeadingStr = fulldayHoursInFloat
		// 		mailTable2 +=  '<tr><td><table style="width:100%;margin-top: 20px;"><tr><td><div style="font-weight: bold;padding-bottom:10px">Summary</div>'
		// 		mailTable2 += '<div style="padding-bottom:10px;display:block;padding-bottom:12px;height: 14px;"><div style="float: left;width:140px">Actual hours</div><div style="float: left;font-weight: bold;">: 40:00</div></div>'
		// 		mailTable2 += '<div style="margin-bottom:10px;display: block;height: 14px;clear: both;"><div style="float: left;width:140px">Work hours</div><div style="float: left;font-weight: bold;">: ' + '0.00' + '</div></div>'
		// 		mailTable2 += '<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Break hours</div><div style="float: left;">: ' + '0.00' + '</div></div>'
		// 		mailTable2 += '<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Full Leave hours</div><div style="float: left;">: ' + fullDayHoursLeadingStr + "( "+ fullDays  + " )" + '</div></div>'
		// 		mailTable2 += '<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Half Day Leave hours</div><div style="float: left;">: ' + halfDayHoursLeadingStr + "( "+ halfdays + " )" + '</div></div>'
		// 		mailTable2 += '<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Permission Count</div><div style="float: left;">: ' + permissionCount  + '</div></div>'
		// 		mailTable2 += '<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Work from home hours</div><div style="float: left;">: ' + '00.00' +  "( "+ workFromDays + " )"   + '</div></div>'
		// 		mailTable2 += '</td></tr></table></td></tr></tbody></table>'
		// 		const path = `${config.uploadPath}/attendanceSummary/attendance ${userSingleObj.email} - ${mailFullMondayFormated} to ${mailFullFridayFromated}.xlsx`;
		// 			//fs.createWriteStream(path).write(buffer);
		// 	//	this.sendWeeklyMail(userSingleObj.email,mailFullMondayFormated,mailFullFridayFromated,userSingleObj,buffer,mailTable2)
		// 	}
		// 	console.log("filterobj",filterObj.length)

		// })
		// console.log("usercurrentOBj",userCurrentOBj.length)
	},

	async sendMailToNonAttendanceUser(
		userAttendanceData,
		mondayFormated,
		fridayFormated,
		mailFullMondayFormated,
		mailFullFridayFromated,
		mailMondayFromated,
		mailFridayFromated
	) {
		const userCurrentOBj = await users.findAll({
			where: {
				isActive: true,
				onshore: false,
			},
		});

		userCurrentOBj.forEach(async (userSingleObj, index) => {
			console.log("usersingobj", userSingleObj);
			let leavesData = await leaves.findAll({
				where: {
					fromDateFormat: {
						$between: [mondayFormated, fridayFormated],
					},
					userId: userSingleObj.id,
				},
			});

			console.log("leavesDataArray", leavesData);

			var fulldayCount = 0;
			var halfdayCount = 0;
			var fulldayLeaveHours = 0;
			var halfdayLeaveHours = 0;
			var permissionHours = 0.0;
			var permissionCount = 0;
			var workFromHomHours = 0;
			var workFromHomeHoursCount = 0;
			for (let index = 0; index < leavesData.length; index++) {
				console.log("obj", leavesData[index]);
				if (leavesData[index].request === "Full Day") {
					fulldayCount = fulldayCount + 1;
					fulldayLeaveHours = fulldayLeaveHours + 8;
					//fulldayLeaveHours = fulldayLeaveHours.toFixed(2)
				} else if (leavesData[index].request === "Half Day") {
					halfdayCount = halfdayCount + 1;
					halfdayLeaveHours = halfdayLeaveHours + 4;
					//halfdayLeaveHours = halfdayLeaveHours.toFixed(2)
				} else if (leavesData[index].request === "Permission") {
					permissionCount = permissionCount + 1;
				} else if (leavesData[index].request === "Work from Home") {
					workFromHomeHoursCount = workFromHomeHoursCount + 1;
				}
			}
			var fullDays =
				fulldayCount > 0
					? `${fulldayCount} Days`
					: `${fulldayCount} Day`;
			var halfdays =
				halfdayCount > 0
					? `${halfdayCount} Days`
					: `${halfdayCount} Day`;
			var workFromDays =
				workFromHomeHoursCount > 0
					? `${workFromHomeHoursCount} Days`
					: `${workFromHomeHoursCount} Day`;
			var attendance = [];
			const filterObj = userAttendanceData.filter(
				(val) => val.id == userSingleObj.id
			);

			let mailTable2 =
				'<table style="width: 600px;margin: 0 auto;min-width: 600px;background: #f9f9f9;padding: 26px 20px 50px;font-family: arial;border-radius:4px;"cellpadding = "0" cellspacing = "0"><tbody><tr><td style="width: 100%;text-align: center;padding-bottom: 40px;"><div><img src="https://www.greatinnovus.com/blogs/wp-content/uploads/2022/01/GI_newcolor.png" width="225" style="padding-top: 10px;"></div></td></tr><tr><td><table style="width: 100%;margin-bottom: 15px;"><tr><td style="width: 407px;"><div><b style="float: left;padding-right: 6px;">Name :</b><div>' +
				userSingleObj.userName +
				'</div></div></td><td><div><b style="float: left;padding-right: 6px;">Employee ID :</b><div>' +
				userSingleObj.employeeId +
				'</div></div></td></tr></table></td> </tr><tr><td><table style="width: 100%;margin-bottom: 15px;"><tr><td><div><b style="float: left;padding-right: 6px;">Report Date :</b><div>' +
				mailFullMondayFormated +
				" to " +
				mailFullFridayFromated +
				'</div></div></td></tr></table></td></tr><tr><td><table style="width:100%;"><tr><td><table style="width:100%;border-collapse: collapse;border: 1px solid;"><tr><th style="border: 1px solid #000;padding: 2px 6px;background: #5ca529;color: #fff;font-weight: normal;">Day</th><th style="border: 1px solid #000;padding: 2px 6px;background: #5ca529;color: #fff;font-weight: normal;">Work Hours</th> <th style="border: 1px solid #000;padding: 2px 6px;background: #5ca529;color: #fff;font-weight: normal;">Break Hours</th><th style="border: 1px solid #000;padding: 2px 6px;background: #5ca529;color: #fff;font-weight: normal;">Status</th><th style="border: 1px solid #000;padding: 2px 6px;background: #5ca529;color: #fff;font-weight: normal;">Work Form</th></tr>';
			if (filterObj.length == 0) {
				let mondayFormatedCount = new Date(mondayFormated).getDate();

				let mondayMonthFormated = new Date(mondayFormated).getMonth();
				let mondayFormatedYear = new Date(mondayFormated).getFullYear();

				let fridayFormatedDate = new Date(fridayFormated).getDate();
				for (
					let index = mondayFormatedCount;
					index <= fridayFormatedDate;
					index++
				) {
					let date = new Date(
						mondayFormatedYear,
						mondayMonthFormated,
						mondayFormatedCount
					);
					let formatedDate = moment(date).format("DD-MM-YYYY");

					let FormatDateWithYY = moment(date).format("YYYY-MM-DD");

					var presentStatus = "Absent";
					for (
						let subIndex = 0;
						subIndex < leavesData.length;
						subIndex++
					) {
						if (
							FormatDateWithYY >=
								leavesData[subIndex].fromDateFormat &&
							FormatDateWithYY <=
								leavesData[subIndex].toDateFormat
						) {
							console.log("called inside");
							presentStatus = "Leave";
						}
					}
					attendance.push({
						date: formatedDate,
						workHours: "-",
						breakHours: "-",
						status: presentStatus,
						statusColor: "",
						breakStatusColor: "-",
						workFrom: "-",
					});
					mondayFormatedCount = mondayFormatedCount + 1;
				}

				for (let index = 0; index < attendance.length; index++) {
					mailTable2 +=
						'<tr><td style="border: 1px solid;padding: 2px 6px;text-align: center;">' +
						attendance[index].date +
						'</td><td style="border: 1px solid;padding: 2px 6px;text-align: center;">' +
						attendance[index].workHours +
						'</td><td style="border: 1px solid;padding: 2px 6px;text-align: center;text-align: center;">' +
						attendance[index].breakHours +
						'</td><td style="border: 1px solid;padding: 2px 6px;">' +
						attendance[index].status +
						'</td><td style="border: 1px solid;padding: 2px 6px;">' +
						attendance[index].workFrom +
						"</td></tr>";

					//	mailTable2 += '<tr><td style="border: 1px solid;padding: 2px 6px;text-align: center;">' + attendance[index].date  + '</td><td style="border: 1px solid;padding: 2px 6px;">'+ attendance[index].workHours +'</td><td style="border: 1px solid;padding: 2px 6px;">'+ attendance[index].breakHours   +'</td><td style="border: 1px solid;padding: 2px 6px;">'+  attendance[index].status   +'</td><td style="border: 1px solid;padding: 2px 6px;">'+ attendance[index].workFrom +'</td></tr>'
				}
				mailTable2 += "</table></td></tr></table></td></tr>";

				let workbook = new excel.Workbook();
				let worksheet = workbook.addWorksheet("Attendance");
				// worksheet.mergeCells('A1', 'D2');
				worksheet.getCell("A1").value =
					"Name: " + userSingleObj.userName;
				worksheet.getCell("D1").value =
					"Employee ID: " + userSingleObj.employeeId;
				worksheet.getCell("A3").value =
					"Report Date: " +
					mailMondayFromated +
					" to " +
					mailFridayFromated;
				worksheet.getRow(1).font = { bold: true };

				worksheet.getRow(4);
				worksheet.getRow(4).font = {
					color: { argb: "FFFFFF" },
					bold: true,
				};
				// worksheet.getRow(4).fill = {  patternType: "solid",
				// fgColor: { rgb: "6d9eeb" }};
				worksheet.getRow(4).values = [
					"Day",
					"Work Hours",
					"Break Hours",
					"workFrom",
				];
				worksheet.columns = [
					{
						key: "date",
						width: 25,
					},
					{
						key: "workHours",
						width: 25,
					},
					{
						key: "breakHours",
						width: 25,
					},
					{
						key: "workFrom",
						width: 25,
					},
				];
				worksheet.addRows(attendance);

				worksheet.eachRow((row, rowNumber) => {
					row.eachCell((cell, colNumber) => {
						if (rowNumber == 4) {
							// First set the background of header row
							cell.fill = {
								type: "pattern",
								pattern: "solid",
								fgColor: { argb: "6d9eeb" },
							};
						}
						if (
							(rowNumber > 4 && colNumber == 3) ||
							(rowNumber > 4 && colNumber == 4) ||
							(rowNumber > 4 && colNumber == 2) ||
							(rowNumber > 4 && colNumber == 1)
						) {
							cell.font = {
								bold: true,
							};
						}
						// Set border of each cell
						cell.border = {
							top: { style: "thin" },
							left: { style: "thin" },
							bottom: { style: "thin" },
							right: { style: "thin" },
						};
					});
					//Commit the changed row to the stream
					row.commit();
				});
				const buffer = await workbook.xlsx.writeBuffer();
				var fulldayHoursInFloat = fulldayLeaveHours.toFixed(2);
				var halfdayHoursInFloat = halfdayLeaveHours.toFixed(2);
				var halfDayHoursLeadingStr = halfdayHoursInFloat;
				var fullDayHoursLeadingStr = fulldayHoursInFloat;
				mailTable2 +=
					'<tr><td><table style="width:100%;margin-top: 20px;"><tr><td><div style="font-weight: bold;padding-bottom:10px">Summary</div>';
				mailTable2 +=
					'<div style="padding-bottom:10px;display:block;padding-bottom:12px;height: 14px;"><div style="float: left;width:140px">Actual hours</div><div style="float: left;font-weight: bold;">: 40:00</div></div>';
				mailTable2 +=
					'<div style="margin-bottom:10px;display: block;height: 14px;clear: both;"><div style="float: left;width:140px">Work hours</div><div style="float: left;font-weight: bold;">: ' +
					"0.00" +
					"</div></div>";
				mailTable2 +=
					'<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Break hours</div><div style="float: left;">: ' +
					"0.00" +
					"</div></div>";
				mailTable2 +=
					'<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Full Leave hours</div><div style="float: left;">: ' +
					fullDayHoursLeadingStr +
					"( " +
					fullDays +
					" )" +
					"</div></div>";
				mailTable2 +=
					'<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Half Day Leave hours</div><div style="float: left;">: ' +
					halfDayHoursLeadingStr +
					"( " +
					halfdays +
					" )" +
					"</div></div>";
				mailTable2 +=
					'<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Permission Count</div><div style="float: left;">: ' +
					permissionCount +
					"</div></div>";
				mailTable2 +=
					'<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Work from home hours</div><div style="float: left;">: ' +
					"00.00" +
					"( " +
					workFromDays +
					" )" +
					"</div></div>";
				mailTable2 += "</td></tr></table></td></tr></tbody></table>";
				const path = `${config.uploadPath}/attendanceSummary/attendance ${userSingleObj.userName} ( ${userSingleObj.employeeId} ) - ${mailFullMondayFormated} to ${mailFullFridayFromated}.xlsx`;
				fs.createWriteStream(path).write(buffer);

				setTimeout(() => {
					this.sendWeeklyMail(
						userSingleObj.email,
						mailFullMondayFormated,
						mailFullFridayFromated,
						userSingleObj,
						buffer,
						mailTable2
					);
					// this.sendWeeklyMail(userSingleObj.email,mailFullMondayFormated,mailFullFridayFromated,userSingleObj,buffer,mailTable2)
					// 	this.sendWeeklyMail(userSingleObj.email,mailFullMondayFormated,mailFullFridayFromated,userSingleObj,buffer,mailTable2)
				}, 1000 * index);
			}
			console.log("filterobj", filterObj.length);
		});
	},

	convertTimeFrom12To24(time) {
		console.log("time", time);
		let hours = Number(time.match(/^(\d+)/)[1]);
		let minutes = Number(time.match(/:(\d+)/)[1]);
		console.log(hours);
		const AMPM = time.match(/\s(.*)$/)[1];
		if (AMPM.toLowerCase() === "pm" && hours < 12) hours = hours + 12;
		if (AMPM.toLowerCase() === "am" && hours == 12) hours = hours - 12;

		let sHours = hours.toString();
		let sMinutes = minutes.toString();
		if (hours < 10) sHours = "0" + sHours;
		if (minutes < 10) sMinutes = "0" + sMinutes;

		console.log(`${sHours}:${sMinutes}`);
		return `${sHours}:${sMinutes}`;
	},
	diffTime(time1, time2) {
		var hour1 = time1.split(":")[0];
		var hour2 = time2.split(":")[0];
		var min1 = time1.split(":")[1];
		var min2 = time2.split(":")[1];

		var diff_hour = hour2 - hour1;
		var diff_min = min2 - min1;
		if (diff_hour < 0) {
			diff_hour += 24;
		}
		if (diff_min < 0) {
			diff_min += 60;
			diff_hour--;
		} else if (diff_min >= 60) {
			diff_min -= 60;
			diff_hour++;
		}
		return [diff_hour, diff_min];
	},
	sendWeeklyMail(toaddress, start, end, email, content, mailtable) {
		var sendoption = {
			from: config.commonEmail,
			to: toaddress,
			cc: [config.email1, config.email2],
			subject:
				"Weekly attendance report " +
				email.email +
				"( " +
				email.employeeId +
				" )" +
				start +
				" to " +
				end,
			html: mailtable,
			attachments: [
				{
					filename: `attendance ${email.email} ( ${email.employeeId} ) - ${start} to ${end}.xlsx`,
					content: content,
					contentType:
						"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				},
			],
		};
		console.log("sendoptions", sendoption);
		//setTimeout(function() {

		this.sendMailFromNodeUsingUserId(
			sendoption,
			email.id,
			email.email,
			"Weekly attendance report " +
				email.email +
				"( " +
				email.employeeId +
				" )" +
				start +
				" to " +
				end
		);
		// this.sendMailFromNodeUsingUserId(sendoption,email.id,email.email, "Weekly attendance report " + email.email  + '( ' + email.employeeId  + ' )' + start + ' to ' + end)
		// 	this.sendMailFromNodeUsingUserId(sendoption,email.id,email.email, "Weekly attendance report " + email.email  + '( ' + email.employeeId  + ' )' + start + ' to ' + end)

		// }, 10000);

		//this.sendMailFromNode(sendoption)
	},

	async workSummary(attendance, mondayDate, fridayDAte, leavesData) {
		var attendanceArray = [];
		var totalDays = 0;
		console.log("attendanceArray", attendance);
		while (mondayDate <= fridayDAte) {
			var mm =
				mondayDate.getMonth() + 1 >= 10
					? mondayDate.getMonth() + 1
					: "0" + (mondayDate.getMonth() + 1);
			var dd =
				mondayDate.getDate() >= 10
					? mondayDate.getDate()
					: "0" + mondayDate.getDate();
			var yyyy = mondayDate.getFullYear();
			//var date = dd+"-"+mm+"-"+yyyy; //yyyy-mm-dd

			//console.log("dasyyyy",date)

			//date increase by 1
			// }
			// for (let index = mondayFormatedCount; index <= fridayFormatedDate; index++) {

			let date = new Date(yyyy, mm - 1, dd);

			let day = date.getDay();
			if (day != 6 && day != 0) {
				totalDays = totalDays + 1;
			}
			//console.log("dayvalue", day)
			let formatedDate = moment(date).format("DD-MM-YYYY");
			let formatedDateCheck = moment(date).format("YYYY-MM-DD");

			console.log("formatedDate", formatedDate);
			const filteredAttendance = attendance.filter(
				(val) => val.date === formatedDate
			);

			console.log("filteredAttendance", filteredAttendance.length);

			if (filteredAttendance.length == 0) {
				var presentStatus = "Absent";
				console.log("leavessdata", leavesData);
				for (
					let subIndex = 0;
					subIndex < leavesData.length;
					subIndex++
				) {
					if (
						formatedDateCheck >=
							leavesData[subIndex].fromDateFormat &&
						formatedDateCheck <= leavesData[subIndex].toDateFormat
					) {
						if (leavesData[subIndex].request === "Full Day") {
							presentStatus = "Leave";
						}
					}
				}

				attendanceArray.push({
					date: formatedDate,
					workHours: "-",
					breakHours: "-",
					inTime: "",
					outTime: "",
					status: presentStatus,
					statusColor: "",
					breakStatusColor: "",
					workFrom: "-",
				});
			}
			//mondayFormatedCount = mondayFormatedCount + 1
			mondayDate = new Date(mondayDate.setDate(mondayDate.getDate() + 1));
		}

		return [attendanceArray, totalDays];
	},

	async workAttendanceArraySummary(userSingleObj, leavesData) {
		console.log("singleobj", userSingleObj);

		let attendance = [];

		let overAllWorkingMins = 0;
		let overAllBreakMins = 0;
		let workFromHomHours = 0;
		for (let index = 0; index < userSingleObj.attendances.length; index++) {
			var presentStatus = "Present";
			for (let subIndex = 0; subIndex < leavesData.length; subIndex++) {
				if (
					userSingleObj.attendances[index].attendanceDate >=
						leavesData[subIndex].fromDateFormat &&
					userSingleObj.attendances[index].attendanceDate <=
						leavesData[subIndex].toDateFormat
				) {
					if (leavesData[index].request === "Half Day") {
						presentStatus = "Present + H";
					} else if (leavesData[index].request === "Permission") {
						presentStatus = "Present + P";
					}
				}
			}
			console.log("userSingleObj.attendance", userSingleObj.attendances);
			let attendanceObj = userSingleObj.attendances[index];
			let convertedMins = parseInt(
				moment.duration(attendanceObj.totalHours).asMinutes()
			);

			const leaveDataObj = leavesData.filter((val) => val.fromDateFormat);
			overAllWorkingMins += convertedMins;

			if (attendanceObj.attendanceType === "Work from Home") {
				workFromHomHours += convertedMins;
			}

			var statusColor = "green";

			if (convertedMins >= 600) {
				statusColor = "orange";
			} else if (convertedMins < 480) {
				statusColor = "red";
			}
			//mailTable += '<tr><td style="background-color:red">' + attendanceObj.dateOfAttendance + '</td><td>' + attendanceObj.totalHours + '</td><td>' + attendanceObj.totalBreakHours + '</td></tr>';

			let convertedBreakMins = parseInt(
				moment.duration(attendanceObj.totalBreakHours).asMinutes()
			);
			overAllBreakMins += convertedBreakMins;

			var breakStatusColor = "";
			if (convertedBreakMins < 60) {
				breakStatusColor = "red";
			}
			attendance.push({
				date: attendanceObj.dateOfAttendance,
				workHours: attendanceObj.totalHours,
				inTime: attendanceObj.inTime,
				outTime: attendanceObj.outTime,
				breakHours: attendanceObj.totalBreakHours,
				status: presentStatus,
				statusColor: statusColor,
				breakStatusColor: breakStatusColor,
				workFrom:
					attendanceObj.attendanceType == "QR" ? "Office" : "Home",
			});
		}

		return [
			attendance,
			overAllWorkingMins,
			overAllBreakMins,
			workFromHomHours,
		];
	},
	async leavesDataCheck(leavesData) {
		var fulldayCount = 0;
		var halfdayCount = 0;
		var fulldayLeaveHours = 0;
		var halfdayLeaveHours = 0;

		var permissionHours = 0.0;
		var permissionCount = 0;
		var workFromHomHours = 0;
		var workFromHomeHoursCount = 0;

		var leavesDateArray = [];
		for (let index = 0; index < leavesData.length; index++) {
			console.log("obj", leavesData[index]);
			if (leavesData[index].request === "Full Day") {
				fulldayCount = fulldayCount + 1;
				fulldayLeaveHours = fulldayLeaveHours + 8;
				// fulldayLeaveHours = fulldayLeaveHours.toFixed(2)
			} else if (leavesData[index].request === "Half Day") {
				halfdayCount = halfdayCount + 1;
				halfdayLeaveHours = halfdayLeaveHours + 4;
				// halfdayLeaveHours= halfdayLeaveHours.toFixed(2)
			} else if (leavesData[index].request === "Permission") {
				permissionCount = permissionCount + 1;
			} else if (leavesData[index].request === "Work from Home") {
				workFromHomeHoursCount = workFromHomeHoursCount + 1;
			}
		}
		var response = {};
		response.halfdayCount = halfdayCount;
		response.fulldayCount = fulldayCount;
		response.fulldayLeaveHours = fulldayLeaveHours;
		response.halfdayLeaveHours = halfdayLeaveHours;
		response.permissionCount = permissionCount;
		response.workFromHOmeCount = workFromHomeHoursCount;

		return response;
	},

	async getPreviousMonday() {
		var date = new Date();
		var day = date.getDay();
		var prevMonday = new Date();
		if (date.getDay() == 0) {
			prevMonday.setDate(date.getDate() - 7);
		} else {
			prevMonday.setDate(date.getDate() - (day - 1));
		}

		return prevMonday;
	},

	async getMondayOfCurrentWeek() {
		const today = new Date();
		const first = today.getDate() - today.getDay() + 1;

		const monday = new Date(today.setDate(first));
		return monday;
	},

	async createInitialRecord(tableName, records) {
		try {
			if (tableName == "users") {
				let usersCount = await users.count();
				if (usersCount === 0) {
					await users.create(records);
				} else {
					console.log("super admin data already initialized");
				}
			} else if (tableName == "roles") {
				let rolesCount = await roles.count();
				if (rolesCount === 0) {
					await roles.bulkCreate(records);
				} else {
					console.log("roles data already initialized");
				}
			} else if (tableName == "positions") {
				let positionCount = await positions.count();
				console.log("positionCount", positionCount);
				if (positionCount === 0) {
					await positions.create(records);
				} else {
					console.log("roles data already initialized");
				}
			}
		} catch (err) {
			console.log("err" + err);
		}
	},

	sendLeaveRequest(mailOptions, toaddress) {
		var leaveRequestTemplate;

		leaveRequestTemplate = path.resolve("src/template/leaveRequest.html");

		this.readHTMLFile(leaveRequestTemplate, async (err, html) => {
			if (err) {
				console.log(err);
				return false;
			}
			const template = Handlebars.compile(html);
			const replacements = {
				name: mailOptions.name,
				email: mailOptions.email,
				reason: mailOptions.reason,
				approvedBy: mailOptions.approvedBy,
				status: mailOptions.status,
				startDate: mailOptions.startDate,
				endDate: mailOptions.endDate,
				requestedDate: mailOptions.requestedDate,
				leaveType: mailOptions.leaveType,
				id: mailOptions.id,
			};

			const htmlToSend = template(replacements);

			var sendoption = {
				from: config.commonEmail,
				to: toaddress,
				cc: config.commonEmail,
				subject: mailOptions.sub,
				html: htmlToSend,
			};
			console.log("sendoptions", sendoption);
			this.sendMailFromNode(sendoption);
			// transporter.sendMail(sendoption, function (error, info) {
			// 	if (error) {
			// 		console.log("send mail error : " + error.message);
			// 	} else {
			// 		console.log("Email sent: " + info.response);
			// 	}
			// });
		});
	},

	sendCreateLeaveRequest(mailOptions, teamEmail) {
		var leaveRequestTemplate;

		leaveRequestTemplate = path.resolve("src/template/leaveRequest.html");

		this.readHTMLFile(leaveRequestTemplate, async (err, html) => {
			if (err) {
				console.log(err);
				return false;
			}
			const template = Handlebars.compile(html);
			const replacements = {
				name: mailOptions.name,
				email: mailOptions.email,
				reason: mailOptions.reason,
				status: mailOptions.status,
				approvedBy: mailOptions.approvedBy,
				startDate: mailOptions.startDate,
				endDate: mailOptions.endDate,
				requestedDate: mailOptions.requestedDate,
				leaveType: mailOptions.leaveType,
				id: mailOptions.id,
			};

			const htmlToSend = template(replacements);

			const stringUsersMail = teamEmail.join(", ");
			console.log("mail", stringUsersMail);
			var sendoption = {
				from: config.commonEmail,
				to: stringUsersMail,
				// cc: teamEmail,
				subject: mailOptions.sub,
				html: htmlToSend,
			};
			console.log("sendoptions create leave", sendoption);
			this.sendMailFromNode(sendoption);
			// transporter.sendMail(sendoption, function (error, info) {
			// 	if (error) {
			// 		console.log("send mail error : " + error.message);
			// 	} else {
			// 		console.log("Email sent: " + info.response);
			// 	}
			// });
		});
	},
	sendDeviceRequest(mailOptions, toaddress) {
		var leaveRequestTemplate;

		leaveRequestTemplate = path.resolve("src/template/deviceRequest.html");

		this.readHTMLFile(leaveRequestTemplate, async (err, html) => {
			if (err) {
				console.log(err);
				return false;
			}
			const template = Handlebars.compile(html);
			const replacements = {
				name: mailOptions.name,
				email: mailOptions.email,

				status: mailOptions.status,

				id: mailOptions.id,
			};

			const htmlToSend = template(replacements);

			var sendoption = {
				from: config.commonEmail,
				to: toaddress,
				cc: config.commonEmail,
				subject: mailOptions.sub,
				html: htmlToSend,
			};
			this.sendMailFromNode(sendoption);
		});
	},

	generateQRCode(mailOptions, code) {
		var generateQRCodeTemplate;
		generateQRCodeTemplate = path.resolve(
			"src/template/generateQRCode.html"
		);
		this.readHTMLFile(generateQRCodeTemplate, async (err, html) => {
			if (err) {
				console.log(err);
				return false;
			}
			const template = Handlebars.compile(html);
			const replacements = {
				name: mailOptions.name,
				email: mailOptions.email,
				// reason: mailOptions.reason,
				// status: mailOptions.status,
				// startDate: mailOptions.startDate,
				// endDate: mailOptions.endDate,
				// requestedDate: mailOptions.requestedDate,
				// leaveType: mailOptions.leaveType,
				// id: mailOptions.id
			};
			const htmlToSend = template(replacements);
			var sendoption = {
				from: config.commonEmail,
				to: mailOptions.to,
				subject: mailOptions.sub,
				html: htmlToSend,
				// attachments: [{
				// 	filename: mailOptions.to + ".jpg",
				// 	contentType: 'image/jpeg',
				// 	content: new Buffer.from(code.split("base64,")[1], "base64"),
				// }]
			};
			this.sendMailFromNode(sendoption);
			// transporter.sendMail(sendoption, function (error, info) {
			// 	if (error) {
			// 		console.log("send mail error : " + error.message);
			// 	} else {
			// 		console.log("Email sent: " + info.response);
			// 	}
			// });
		});
	},
	deleteFile(filename) {
		console.log(path.join(modelsDir), "directory name");
		console.log(path.join(modelsDir, filename), "directory name");
		const filePath = path.join(modelsDir, filename);
		fs.unlink(filePath, function (err) {
			if (err) return;
			//console.log(err);
			console.log("file deleted successfully");
		});
	},
};
