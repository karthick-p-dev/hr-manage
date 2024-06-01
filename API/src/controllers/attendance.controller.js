import _ from "lodash";
import db from "../../config/sequelize";
import helpers from "../helpers/helper";
import moment from "moment";
import utilsService from "../services/utils.service";
import writeXlsxFile from 'write-excel-file'
import config from "../../config/config";
const excel = require("exceljs");
import fs from "fs";
import { response } from "express";
var request = require("request");
const { users, attendances, companies, leaves, seckeys } = db;
const Op = db.Sequelize.Op;

const AttendancesController = () => {
	const addnew = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log(reqObj);
		if (!reqObj.dateOfAttendance) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Date Of Attendance is required"
			);
		}
		if (!reqObj.attendanceType) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Attendance Type is required."
			);
		}
		if (reqObj.secretkey) {
			var secretkey = await seckeys.findOne({
				where: {
					secretKey: reqObj.secretkey,
				},
			});
			if (!secretkey) {
				return helpers.appresponse(
					res,
					404,
					false,
					null,
					"QR expired."
				);
			}
		}
		if (reqObj.employeeId) {
			var userdara = await users.findOne({
				where: {
					employeeId: reqObj.employeeId,
					isActive: true,
				},
			});
			if (!userdara) {
				return helpers.appresponse(
					res,
					404,
					false,
					null,
					"Please check user id"
				);
			}
			reqObj.userId = userdara.id;
		}
		if (!reqObj.userId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"User Id is required"
			);
		}
		const dateArray = reqObj.dateOfAttendance.split('-');




		var checkFromDate = new Date(
			parseInt(dateArray[2]),
			parseInt(dateArray[1]) - 1,
			parseInt(dateArray[0]),
		);

		reqObj.createdAt = Date.now();
		reqObj.updateddAt = Date.now();
		var attendancesdata = await attendances.findOne({
			where: {
				dateOfAttendance: reqObj.dateOfAttendance,
				userId: reqObj.userId,
			},
		});
		var usersdata = await users.findOne({
			where: {
				id: reqObj.userId,
				isActive: true,
			},
		});
		if (!usersdata) {
			return helpers.appresponse(res, 404, false, [], "User not found .");
		}
		var companydata = await companies.findOne({
			where: {
				id: usersdata.companyId,
			},
		});
		console.log("company data is :", companydata);
		if (attendancesdata && attendancesdata.dateOfAttendance) {
			if (attendancesdata.isActive == true) {
				if (!reqObj.outTime) {
					return helpers.appresponse(
						res,
						404,
						false,
						null,
						"Out Time is required"
					);
				}
				var newOutTime = "";
				console.log(
					"attendancesdata.firstOut " + attendancesdata.firstOut
				);
				if (attendancesdata.firstOut == true) {
					newOutTime = reqObj.outTime;
				} else {
					newOutTime = attendancesdata.outTime + " " + reqObj.outTime;
				}
				await attendances.update(
					{
						outTime: newOutTime,
						isActive: false,
						firstOut: false,
						status: "out",
						attendanceType: reqObj.attendanceType,
						updateddAt: Date.now(),
					},
					{
						where: {
							dateOfAttendance: reqObj.dateOfAttendance,
							userId: reqObj.userId,
						},
					}
				);
				var attendancesdata2 = await attendances.findOne({
					where: {
						dateOfAttendance: reqObj.dateOfAttendance,
						userId: reqObj.userId,
					},
				});

				var totalhours = checktimedifference(
					attendancesdata2.inTime,
					attendancesdata2.outTime
				);
				console.log("total hours is " + totalhours);
				var arrayodtime = totalhours.split(":");
				console.log("arrayodtime is " + arrayodtime);
				var timeinthour = parseInt(arrayodtime[0]);
				console.log("timeinthour is " + timeinthour);
				var attendancestatus = "Absent";
				if (timeinthour >= companydata.halfDayTime) {
					attendancestatus = "Half day";
				}
				if (timeinthour >= companydata.fullDayTiming) {
					attendancestatus = "Present";
				}
				await attendances.update(
					{
						totalHours: totalhours,
						attendanceStatus: attendancestatus,
						attendanceType: reqObj.attendanceType,
						updateddAt: Date.now(),
					},
					{
						where: {
							dateOfAttendance: reqObj.dateOfAttendance,
							userId: reqObj.userId,
						},
					}
				);
			} else {
				if (!reqObj.inTime) {
					return helpers.appresponse(
						res,
						404,
						false,
						null,
						"In Time is required"
					);
				}
				var newInTime = attendancesdata.inTime + " " + reqObj.inTime;
				var breaktime = checkbreaktime(
					attendancesdata.outTime,
					reqObj.inTime,
					attendancesdata.totalBreakHours
				);
				await attendances.update(
					{
						inTime: newInTime,
						isActive: true,
						status: "in",
						totalBreakHours: breaktime,
						attendanceType: reqObj.attendanceType,
						updateddAt: Date.now(),
					},
					{
						where: {
							dateOfAttendance: reqObj.dateOfAttendance,
							userId: reqObj.userId,
						},
					}
				);
			}
		} else {
			var iamgename;
			if (!reqObj.inTime) {
				return helpers.appresponse(
					res,
					404,
					false,
					null,
					"In Time is required"
				);
			}
			// if (reqObj.attendanceType == "manual") {
			//     if (!reqObj.manualImage) {
			//         return helpers.appresponse(res,
			//             404,
			//             false,
			//             null,
			//             "Manual image is required"
			//         );
			//     }
			//     iamgename = imageuploadcontoller.getupload().single("manualImage");
			// }
			reqObj.totalHours = "00:00";
			await attendances.create({
				dateOfAttendance: reqObj.dateOfAttendance,
				attendanceDate: checkFromDate,
				userId: reqObj.userId,
				outTime: reqObj.totalHours,
				totalHours: reqObj.totalHours,
				inTime: reqObj.inTime,
				status: "in",
				attendanceType: reqObj.attendanceType,
				createdAt: Date.now(),
				updateddAt: Date.now(),
			});
		}
		attendances
			.findOne({
				where: {
					dateOfAttendance: reqObj.dateOfAttendance,
					userId: reqObj.userId,
				},
				attributes: {
					// exclude: ["firstOut", ]
				},
				include: [users],
			})
			.then((attendancesData) => {
				return helpers.appresponse(
					res,
					200,
					true,
					attendancesData,
					"attendance added successfully"
				);
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const getallattenddancebyid = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("request id is : " + reqObj.id);
		users
			.findAll({
				where: {
					id: reqObj.id,
					isActive: true,
				},
				attributes: {
					exclude: ["password", "userOtp"],
				},
				include: [
					{
						model: attendances,
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
					isActive: true,
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

	const checktime = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log(reqObj);
		if (!reqObj.dateOfAttendance) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Date Of Attendance is required"
			);
		}

		if (!reqObj.userId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"User Id is required"
			);
		}

		if (!reqObj.checkTime) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Check Time is required"
			);
		}

		attendances
			.findOne({
				where: {
					dateOfAttendance: reqObj.dateOfAttendance,
					userId: reqObj.userId,
				},
				attributes: {
					//exclude: ["firstOut", ]
				},
			})
			.then((attendancesData) => {
				var totalhouurs = checktimedifference(
					attendancesData.inTime,
					attendancesData.outTime,
					reqObj.checkTime
				);
				attendancesData.totalHours = totalhouurs;
				return helpers.appresponse(
					res,
					200,
					true,
					attendancesData,
					"success"
				);
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const getAttenddanceByTodayDate = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("request date is : " + reqObj.date);
		console.log("request companyid is : " + reqObj.companyId);

		attendances
			.findAll({
				where: {
					dateOfAttendance: reqObj.date,
				},
				attributes: {
					exclude: [],
				},
				include: [
					{
						model: users,
						where: {
							companyId: reqObj.companyId,
							isActive: true,
						},
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
						"No data found"
					);
				}
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const getAttenddanceByToday = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("request date is : " + reqObj.date);
		console.log("request companyid is : " + reqObj.companyId);
		var response = {};
		var presenteduserid = [1];

		users
			.findAll({
				where: {
					companyId: reqObj.companyId,
					isActive: true
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
					},
				],
			})
			.then((userData) => {

				//console.log("user data",userData)

				if (userData) {
					response.present = userData;

					for (let i = 0; i < userData.length; i++) {
						console.log(userData[i].dataValues.userId);
						presenteduserid.push(userData[i].dataValues.id);
						//console.log(presenteduserid);
					}

					users
						.findAll({
							where: {
								id: {
									$notIn: presenteduserid,
								},
								isActive: true,
								companyId: reqObj.companyId,
								isActive: true,
							},
							attributes: {
								exclude: ["password", "userOtp"],
							},
							raw: true,
							nest: true,
						})
						.then((value) => {
							response.absent = value;
							return helpers.appresponse(
								res,
								200,
								true,
								response,
								"success"
							);
						});
				} else {
					return helpers.appresponse(
						res,
						404,
						false,
						[],
						"No data found"
					);
				}
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	function checktimedifference(intimestring, outtimestring, checktime) {
		console.log("intimestring :   ", intimestring);
		console.log("outtimestring :   ", outtimestring);
		console.log(
			"checktime checktime checktime checktime v v checktime checktime checktime checktime" +
			checktime
		);
		// intimestring = "09:00 11:15 14:30 17:15"
		// outtimestring = "11:00 13:30 17:00"
		var invalues = intimestring.split(" ");
		console.log(invalues);
		var outvalues = outtimestring.split(" ");
		console.log(outvalues);
		var hoursarray = [];
		var minutesarray = [];
		if (checktime) {
			outvalues.push(" " + checktime);
		}
		for (var i = 0; i < outvalues.length; i++) {
			console.log("outvalues[i] " + outvalues[i]);
			var startTime = moment(invalues[i], "HH:mm");
			var endTime = moment(outvalues[i], "HH:mm");
			var duration = moment.duration(endTime.diff(startTime));
			var hours = parseInt(duration.asHours());
			console.log("hours " + hours);
			hoursarray.push(hours);
			var minutes = parseInt(duration.asMinutes()) % 60;
			console.log("minutes" + minutes);
			minutesarray.push(minutes);
		}
		var totolhours = 0;
		var totolmin = 0;
		var totalminstring = "";
		var dummymin = 0;
		var totalhourstring = "";
		for (var i = 0; i < hoursarray.length; i++) {
			totolhours = totolhours + hoursarray[i];
		}
		for (var i = 0; i < minutesarray.length; i++) {
			totolmin = totolmin + minutesarray[i];
		}
		dummymin = ~~(totolmin / 60);
		console.log("totolmin" + totolmin);
		console.log("dummymin" + dummymin);
		totolmin = totolmin % 60;
		totolhours = totolhours + dummymin;
		console.log("totolhours" + totolhours);
		console.log("totolmin" + totolmin);
		if (totolmin < 10) {
			totalminstring = "0" + totolmin;
		} else {
			totalminstring = totolmin;
		}
		if (totolhours < 10) {
			totalhourstring = "0" + totolhours;
		} else {
			totalhourstring = totolhours;
		}
		var finalltotalhr = totalhourstring + ":" + totalminstring;
		return finalltotalhr;
	}

	function checkbreaktime(outtimestring, newintime, breakhours) {
		console.log("newintime :   ", newintime);
		console.log("outtimestring :   ", outtimestring);
		console.log("breakhours :   ", breakhours);
		var outvalues = outtimestring.split(" ");
		var breakarray = breakhours.split(":");
		console.log(outvalues);
		console.log(breakarray);
		var lastItem = outvalues.pop();
		var breakhour = parseInt(breakarray[0], 10);
		var breakmin = parseInt(breakarray[1], 10);
		console.log("breakhour " + breakhour + "  breakmin " + breakmin);
		var finalltotalhr = "";
		console.log(
			"lastItem :  " + lastItem + " newintime      : " + newintime
		);
		var startTime = moment(lastItem, "HH:mm");
		var endTime = moment(newintime, "HH:mm");
		var duration = moment.duration(endTime.diff(startTime));
		console.log("duration in break" + duration);
		var hours = parseInt(duration.asHours());
		console.log("hours  in break " + hours);
		var minutes = parseInt(duration.asMinutes()) % 60;
		console.log("minutes" + minutes);
		var updatedhour = breakhour + parseInt(hours, 10);
		var updatedmin = breakmin + parseInt(minutes, 10);
		console.log(
			"updatedhour  " + updatedhour + "  updatedmin  " + updatedmin
		);
		var dummymin = 0;

		if (updatedmin > 59) {
			dummymin = ~~(updatedmin / 60);
			updatedmin = updatedmin % 60;
			updatedhour = updatedhour + dummymin;
		}
		updatedmin = Math.floor(updatedmin);
		if (updatedmin < 10) {
			updatedmin = "0" + updatedmin;
		}
		if (updatedhour < 10) {
			updatedhour = "0" + updatedhour;
		}
		console.log(
			"updatedhour  " + updatedhour + "  updatedmin  " + updatedmin
		);
		finalltotalhr = updatedhour + ":" + updatedmin;

		return finalltotalhr;
	}

	const resqueTime = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("userId", reqObj.userId);
		if (!reqObj.id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"User id is required."
			);
		}
		if (!reqObj.checkdate) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Date of Attendance is required."
			);
		}
		if (!reqObj.dateofAttendance) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Date of Attendance is required."
			);
		}
		var userdata = await users.findOne({
			where: {
				id: reqObj.id,
			},
		});
		if (!userdata) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"User not found."
			);
		}
		console.log("USerData::::", userdata.resqueToken);
		if (!userdata.resqueToken) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Rescuetime token not found,Please Contact HR."
			);
		}
		var resqueKey = userdata.resqueToken;
		var resque = [];
		var dateH = "";
		var rescuedate = "";

		console.log();

		var url =
			"https://www.rescuetime.com/anapi/daily_summary_feed?key=" +
			resqueKey;
		request(url, async function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(
					await JSON.parse(body).length,
					"length of response "
				);
				if (JSON.parse(body) == 0) {
					return helpers.appresponse(
						res,
						404,
						false,
						[],
						"Rescuetime data is empty"
					);
				} else {
					console.log(JSON.parse(body));
					resque = JSON.parse(body);
					console.log("RescueTime 0", resque);
					console.log("RescueTime 0", resque[0]);
					console.log("ReqObj:::", reqObj.dateofAttendance);
					dateH = resque[0].total_duration_formatted.split(" ");
					rescuedate = resque[0].date;
					console.log("CheckDate", reqObj.checkdate);

					if (rescuedate != reqObj.checkdate) {
						return helpers.appresponse(
							res,
							404,
							false,
							[],
							"Rescuetime data is not available for given date."
						);
					}
					console.log(resque[0].total_duration_formatted, "dateH");
					if (!resque[0].total_duration_formatted.includes("h")) {
						return helpers.appresponse(
							res,
							404,
							false,
							[],
							"Please work atleast one hour."
						);
					}
					console.log("DateH", dateH);
					var splited = resque[0].total_duration_formatted.split(" ");
					console.log(splited);
					var hour = splited[0];
					console.log(hour);
					var sephour = hour.split("h")[0];
					console.log(sephour);
					if (sephour < 10) {
						sephour = "0" + sephour;
					}
					var min = splited[1];
					console.log(min);
					var sepmin = min.split("m")[0];
					console.log(sepmin);
					if (sepmin < 10) {
						sepmin = "0" + sepmin;
					}
					var totalDate = sephour + ":" + sepmin;
					console.log(totalDate);

					var attendanceObj = {
						totalHours: totalDate,
					};

					var attendancedata = await attendances.findOne({
						where: {
							dateOfAttendance: reqObj.dateofAttendance,
							userId: reqObj.id,
						},
					});
					var nextattendancedata = await attendances.findOne({
						where: {
							dateOfAttendance: reqObj.nexttorescue,
							userId: reqObj.id,
						},
					});

					if (attendancedata && attendancedata.rescueadded == true) {
						return helpers.appresponse(
							res,
							404,
							false,
							[],
							"Resque Time Already updated"
						);
					}

					console.log(attendancedata, "attendancedata");

					console.log(nextattendancedata, "nextattendancedata");
					const dateArray = reqObj.dateofAttendance.split('-');

					// var checkFromDate = new Date(
					// 	parseInt(dateArray[2]),
					// 	parseInt(dateArray[1]) - 1,
					// 	parseInt(dateArray[0]),
					// );
					var checkFromDate = reqObj.checkdate
					if (!attendancedata && nextattendancedata) {
						console.log("true need to change.");
						await attendances.destroy({
							where: {
								id: nextattendancedata.id,
							},
						});
						await attendances.create({
							dateOfAttendance: reqObj.dateofAttendance,
							attendanceDate: checkFromDate,
							userId: reqObj.id,
							outTime: "00:00",
							totalHours: totalDate,
							inTime: "00:00",
							status: "Rescuetime",
							attendanceType: "Work from Home",
							attendanceStatus: "Present",
							createdAt: Date.now(),
							updateddAt: Date.now(),
						});
						await attendances
							.create({
								dateOfAttendance:
									nextattendancedata.dateOfAttendance,
								attendanceDate: checkFromDate,
								userId: reqObj.id,
								outTime: nextattendancedata.outTime,
								totalHours: nextattendancedata.totalHours,
								inTime: nextattendancedata.inTime,
								status: nextattendancedata.status,
								attendanceType:
									nextattendancedata.attendanceType,
								attendanceStatus:
									nextattendancedata.attendanceStatus,
								firstOut: nextattendancedata.firstOut,
								isActive: nextattendancedata.isActive,
								totalBreakHours:
									nextattendancedata.totalBreakHours,
								createdAt: Date.now(),
								updateddAt: Date.now(),
							})
							.then((attendancesData) => {
								return helpers.appresponse(
									res,
									200,
									true,
									attendancesData,
									"Resque Time created successfully"
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
					} else if (!attendancedata && !nextattendancedata) {
						await attendances
							.create({
								dateOfAttendance: reqObj.dateofAttendance,
								attendanceDate: checkFromDate,
								userId: reqObj.id,
								outTime: "00:00",
								totalHours: totalDate,
								inTime: "00:00",
								status: "Rescuetime",
								attendanceType: "Work from Home",
								attendanceStatus: "Present",
								createdAt: Date.now(),
								updateddAt: Date.now(),
							})
							.then((attendancesData) => {
								return helpers.appresponse(
									res,
									200,
									true,
									attendancesData,
									"Resque Time created successfully"
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
						console.log(
							"attendanceType",
							attendancedata.attendanceType
						);

						if (attendancedata.attendanceType != "Work from Home") {
							console.log(
								"attendancedata in qr mode is : ",
								attendancedata
							);
							var attendancehour = attendancedata.totalHours;
							console.log(
								"attendancedata.totalHours in qr mode is : ",
								attendancehour
							);
							var splittetime = attendancehour.split(":");
							console.log(splittetime);
							var firsthour = parseInt(splittetime[0]);

							var firstmin = parseInt(splittetime[1]);

							console.log(sephour, "datehour");
							console.log(sepmin, "dateMin");
							console.log(typeof sephour, "sephour");
							console.log(typeof sepmin, "sepmin");
							console.log(typeof firsthour, "firsthour");
							console.log(typeof firstmin, "firstmin");
							var totalhr = firsthour + parseInt(sephour);

							var totalmin = firstmin + parseInt(sepmin);
							console.log(totalhr, "totalhr");
							console.log(totalmin, "totalmin");

							var dummyhr = 0;

							if (totalmin > 59) {
								dummyhr = ~~(totalmin / 60);
								console.log(dummyhr, "dummyhr");
								totalmin = totalmin % 60;
								totalhr = totalhr + dummyhr;
							}
							totalmin = Math.floor(totalmin);
							console.log(totalmin, "totalmin");
							if (totalhr < 10) {
								totalhr = "0" + totalhr;
							}
							if (totalmin < 10) {
								totalmin = "0" + totalmin;
							}
							console.log(
								"totalhr  " +
								totalhr +
								"  totalsec  " +
								totalmin
							);
							var finalltotalhr = totalhr + ":" + totalmin;
							console.log("finalltotalhr  " + finalltotalhr);
							await attendances.update(
								{
									totalHours: finalltotalhr,
									rescueadded: true,
									attendanceStatus:
										totalhr >= 8
											? "Present"
											: totalhr >= 4
												? "Half day"
												: "Absent",
								},
								{
									where: {
										dateOfAttendance:
											reqObj.dateofAttendance,
										userId: reqObj.id,
									},
								}
							);

							attendances
								.findOne({
									where: {
										dateOfAttendance:
											reqObj.dateofAttendance,
										userId: reqObj.id,
									},
								})
								.then(async (respons) => {
									return helpers.appresponse(
										res,
										200,
										true,
										respons,
										" updated successfully"
									);
								})
								.catch((err) => {
									return res, 404, false, [], err.message;
								});
						} else {
							await attendances.update(attendanceObj, {
								where: {
									dateOfAttendance: reqObj.dateofAttendance,
									userId: reqObj.id,
								},
							});
							attendances
								.findOne({
									where: {
										dateOfAttendance:
											reqObj.dateofAttendance,
										userId: reqObj.id,
									},
								})
								.then(async (responses) => {
									return helpers.appresponse(
										res,
										200,
										true,
										responses,
										" updated successfully"
									);
								})
								.catch((err) => {
									return (
										res,
										404,
										false,
										err.message,
										"error while updating"
									);
								});
						}
					}
				}
			} else {
				console.log("error in request", error);
				return helpers.appresponse(
					res,
					404,
					false,
					[],
					"Rescuetime data is empty"
				);
			}
		});

		//}
	};


	// const resqueTimeNormalFunction = async (id,checkdate,dateofAttendance,nexttorescue) => {
	// //	const reqObj = helpers.getReqValues(req);
	// 	//console.log("userId", reqObj.userId);



	// 	var userdata = await users.findOne({
	// 		where: {
	// 			id: id,
	// 			isActive : true
	// 		},
	// 	});

	// 	if (!userdata) {
	// 		return 
	// 	}
	// 	console.log("USerData::::", userdata.resqueToken);
	// 	if (!userdata.resqueToken) {
	// 		return 
	// 	}
	// 	var resqueKey = userdata.resqueToken;
	// 	var resque = [];
	// 	var dateH = "";
	// 	var rescuedate = "";

	// 	console.log();

	// 	var url =
	// 		"https://www.rescuetime.com/anapi/daily_summary_feed?key=" +
	// 		resqueKey;
	// 	request(url, async function (error, response, body) {
	// 		if (!error && response.statusCode == 200) {
	// 			console.log(
	// 				await JSON.parse(body).length,
	// 				"length of response "
	// 			);
	// 			if (JSON.parse(body) == 0) {
	// 				return 
	// 			} else {
	// 				console.log(JSON.parse(body));
	// 				resque = JSON.parse(body);
	// 				console.log("RescueTime 0", resque);
	// 				console.log("RescueTime 0", resque[0]);
	// 				console.log("ReqObj:::", dateofAttendance);
	// 				dateH = resque[0].total_duration_formatted.split(" ");
	// 				rescuedate = resque[0].date;
	// 				console.log("CheckDate", checkdate);
	// 				console.log("rescue date",rescuedate)

	// 				if (rescuedate != checkdate) {
	// 					return 
	// 				}
	// 				console.log(resque[0].total_duration_formatted, "dateH");
	// 				if (!resque[0].total_duration_formatted.includes("h")) {
	// 					return 
	// 				}
	// 				console.log("DateH", dateH);
	// 				var splited = resque[0].total_duration_formatted.split(" ");
	// 				console.log(splited);
	// 				var hour = splited[0];
	// 				console.log(hour);
	// 				var sephour = hour.split("h")[0];
	// 				console.log(sephour);
	// 				if (sephour < 10) {
	// 					sephour = "0" + sephour;
	// 				}
	// 				var min = splited[1];
	// 				console.log(min);
	// 				var sepmin = min.split("m")[0];
	// 				console.log(sepmin);
	// 				if (sepmin < 10) {
	// 					sepmin = "0" + sepmin;
	// 				}
	// 				var totalDate = sephour + ":" + sepmin;
	// 				console.log(totalDate);

	// 				var attendanceObj = {
	// 					totalHours: totalDate,
	// 				};

	// 				var attendancedata = await attendances.findOne({
	// 					where: {
	// 						dateOfAttendance: dateofAttendance,
	// 						userId: id,
	// 					},
	// 				});
	// 				var nextattendancedata = await attendances.findOne({
	// 					where: {
	// 						dateOfAttendance: nexttorescue,
	// 						userId: id,
	// 					},
	// 				});

	// 				if (attendancedata && attendancedata.rescueadded == true) {
	// 					return
	// 				}

	// 				console.log(attendancedata, "attendancedata");

	// 				console.log(nextattendancedata, "nextattendancedata");

	// 				if (!attendancedata && nextattendancedata) {
	// 					console.log("true need to change.");
	// 					await attendances.destroy({
	// 						where: {
	// 							id: nextattendancedata.id,
	// 						},
	// 					});
	// 					await attendances.create({
	// 						dateOfAttendance: dateofAttendance,
	// 						userId: id,
	// 						outTime: "00:00",
	// 						totalHours: totalDate,
	// 						inTime: "00:00",
	// 						status: "Rescuetime",
	// 						attendanceType: "Work from Home",
	// 						attendanceStatus: "Present",
	// 						createdAt: Date.now(),
	// 						updateddAt: Date.now(),
	// 					});
	// 					await attendances
	// 						.create({
	// 							dateOfAttendance:
	// 								nextattendancedata.dateOfAttendance,
	// 							userId: id,
	// 							outTime: nextattendancedata.outTime,
	// 							totalHours: nextattendancedata.totalHours,
	// 							inTime: nextattendancedata.inTime,
	// 							status: nextattendancedata.status,
	// 							attendanceType:
	// 								nextattendancedata.attendanceType,
	// 							attendanceStatus:
	// 								nextattendancedata.attendanceStatus,
	// 							firstOut: nextattendancedata.firstOut,
	// 							isActive: nextattendancedata.isActive,
	// 							totalBreakHours:
	// 								nextattendancedata.totalBreakHours,
	// 							createdAt: Date.now(),
	// 							updateddAt: Date.now(),
	// 						})
	// 						.then((attendancesData) => {
	// 							return 
	// 						})
	// 						.catch((err) => {
	// 							return 
	// 						});
	// 				} else if (!attendancedata && !nextattendancedata) {
	// 					await attendances
	// 						.create({
	// 							dateOfAttendance: dateofAttendance,
	// 							userId: id,
	// 							outTime: "00:00",
	// 							totalHours: totalDate,
	// 							inTime: "00:00",
	// 							status: "Rescuetime",
	// 							attendanceType: "Work from Home",
	// 							attendanceStatus: "Present",
	// 							createdAt: Date.now(),
	// 							updateddAt: Date.now(),
	// 						})
	// 						.then((attendancesData) => {
	// 							return 
	// 						})
	// 						.catch((err) => {
	// 							return 
	// 						});
	// 				} else {
	// 					console.log(
	// 						"attendanceType",
	// 						attendancedata.attendanceType
	// 					);

	// 					if (attendancedata.attendanceType != "Work from Home") {
	// 						console.log(
	// 							"attendancedata in qr mode is : ",
	// 							attendancedata
	// 						);
	// 						var attendancehour = attendancedata.totalHours;
	// 						console.log(
	// 							"attendancedata.totalHours in qr mode is : ",
	// 							attendancehour
	// 						);
	// 						var splittetime = attendancehour.split(":");
	// 						console.log(splittetime);
	// 						var firsthour = parseInt(splittetime[0]);

	// 						var firstmin = parseInt(splittetime[1]);

	// 						console.log(sephour, "datehour");
	// 						console.log(sepmin, "dateMin");
	// 						console.log(typeof sephour, "sephour");
	// 						console.log(typeof sepmin, "sepmin");
	// 						console.log(typeof firsthour, "firsthour");
	// 						console.log(typeof firstmin, "firstmin");
	// 						var totalhr = firsthour + parseInt(sephour);

	// 						var totalmin = firstmin + parseInt(sepmin);
	// 						console.log(totalhr, "totalhr");
	// 						console.log(totalmin, "totalmin");

	// 						var dummyhr = 0;

	// 						if (totalmin > 59) {
	// 							dummyhr = ~~(totalmin / 60);
	// 							console.log(dummyhr, "dummyhr");
	// 							totalmin = totalmin % 60;
	// 							totalhr = totalhr + dummyhr;
	// 						}
	// 						totalmin = Math.floor(totalmin);
	// 						console.log(totalmin, "totalmin");
	// 						if (totalhr < 10) {
	// 							totalhr = "0" + totalhr;
	// 						}
	// 						if (totalmin < 10) {
	// 							totalmin = "0" + totalmin;
	// 						}
	// 						console.log(
	// 							"totalhr  " +
	// 								totalhr +
	// 								"  totalsec  " +
	// 								totalmin
	// 						);
	// 						var finalltotalhr = totalhr + ":" + totalmin;
	// 						console.log("finalltotalhr  " + finalltotalhr);
	// 						await attendances.update(
	// 							{
	// 								totalHours: finalltotalhr,
	// 								rescueadded: true,
	// 								attendanceStatus:
	// 									totalhr >= 8
	// 										? "Present"
	// 										: totalhr >= 4
	// 										? "Half day"
	// 										: "Absent",
	// 							},
	// 							{
	// 								where: {
	// 									dateOfAttendance:
	// 										dateofAttendance,
	// 									userId: id,
	// 								},
	// 							}
	// 						);

	// 						attendances
	// 							.findOne({
	// 								where: {
	// 									dateOfAttendance:
	// 										dateofAttendance,
	// 									userId: id,
	// 								},
	// 							})
	// 							.then(async (respons) => {
	// 								return 
	// 							})
	// 							.catch((err) => {
	// 								return 
	// 							});
	// 					} else {
	// 						await attendances.update(attendanceObj, {
	// 							where: {
	// 								dateOfAttendance: dateofAttendance,
	// 								userId: id,
	// 							},
	// 						});
	// 						attendances
	// 							.findOne({
	// 								where: {
	// 									dateOfAttendance:
	// 										dateofAttendance,
	// 									userId: id,
	// 								},
	// 							})
	// 							.then(async (responses) => {
	// 								return 
	// 							})
	// 							.catch((err) => {
	// 								return 
	// 							});
	// 					}
	// 				}
	// 			}
	// 		} else {
	// 			console.log("error in request", error);
	// 			return 
	// 		}
	// 	});

	// 	//}
	// };


	const downloadAttendanceBetweenTwoDate = async (req, res) => {

		const reqObj = helpers.getReqValues(req);
		if (!reqObj.startDate) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Start date is required"
			);

		}
		if (!reqObj.endDate) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"End date is required"
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
		var mondayFormated = moment(reqObj.startDate).format('YYYY-MM-DD')
		var fridayFormated = moment(reqObj.endDate).format('YYYY-MM-DD')

		users
			.findAll({
				where: {
					email: {
						$notIn: ["stevej.india@gmail.com"],
					},
					companyId: reqObj.companyId,
					onShore: false,
					isActive: true
				},

				attributes: {
					exclude: ["password", "userOtp"],
				},
				include: [
					{
						model: attendances,
						// where: {
						// 	attendanceDate: {
						// 		$between: [mondayFormated, fridayFormated]
						// 	},
						// }
					},
				],
			})
			.then(async (userData) => {

				console.log("userdate", userData)


				users.findAll({
					where: {
						email: {
							$notIn: ["stevej.india@gmail.com"],
						},
						onShore: false,
						isActive: false
					},
					attributes: {
						exclude: ["password", "userOtp"],
					},
					include: [
						{
							model: attendances,
							where: {
								attendanceDate: {
									$between: [mondayFormated, fridayFormated]
								},
							}
						},
					],
				}).then(async (InActiveuserData) => {


					let result = userData.concat(InActiveuserData)


					let result1 = userData

					let attendance = [];
					var date = {}
					let workbook = new excel.Workbook();
					let worksheet = workbook.addWorksheet("Attendance");
					const columns = [];
					let mondayStartDate = new Date(mondayFormated)
					let fridayDAte = new Date(fridayFormated)
					columns.push({ header: "Name", key: "name", width: 50 });
					columns.push({ header: "Active Employee", key: "isActive", width: 30 })
					while (mondayStartDate <= fridayDAte) {

						var mm = ((mondayStartDate.getMonth() + 1) >= 10) ? (mondayStartDate.getMonth() + 1) : '0' + (mondayStartDate.getMonth() + 1);
						var dd = ((mondayStartDate.getDate()) >= 10) ? (mondayStartDate.getDate()) : '0' + (mondayStartDate.getDate());
						var yyyy = mondayStartDate.getFullYear();



						//var date = dd+"-"+mm+"-"+yyyy; //yyyy-mm-dd

						//console.log("dasyyyy",date)
					
					
						let date = new Date(yyyy, mm - 1, dd)
						let formatedDate = moment(date).format('DD-MM-YYYY')
						let formatedDateForFilter = moment(date).format('YYYY-MM-DD')
						//console.log("result1",result1)
						//const filteredAttendance = result1.attendances.filter(val => val.attendanceDate === formatedDateForFilter);
						//console.log("filteredAttendance",filteredAttendance)
						columns.push({ header: formatedDate, key: formatedDate, width: 30 });

						mondayStartDate = new Date(mondayStartDate.setDate(mondayStartDate.getDate() + 1));

					}
					worksheet.columns = columns;
					worksheet.getRow(1).font = { bold: true };
					
					for (const obj of result) {
					//result.forEach(async(obj) => {

						let mondayStartDate = new Date(mondayFormated)
						let fridayDAte = new Date(fridayFormated)

						let leavesData = await leaves.findAll({
							where: {
								userId: obj.id,
								fromDateFormat: {
									$between: [mondayFormated, fridayFormated]
								},
		
							}
						})

						console.log("leavedss",leavesData,obj.id)

						var dict = {}

						dict['name'] = obj.email
						dict['isActive'] = obj.isActive == true ? "Active" : "Terminated"

						while (mondayStartDate <= fridayDAte) {


							console.log("monday",mondayStartDate)
							//columns.push({header: mondayStartDate, key: mondayStartDate, width: 30});
							//console.log("column",columns)
							var mm = ((mondayStartDate.getMonth() + 1) >= 10) ? (mondayStartDate.getMonth() + 1) : '0' + (mondayStartDate.getMonth() + 1);
							var dd = ((mondayStartDate.getDate()) >= 10) ? (mondayStartDate.getDate()) : '0' + (mondayStartDate.getDate());
							var yyyy = mondayStartDate.getFullYear();





							let date = new Date(yyyy, mm - 1, dd)


							let formatedDate = moment(date).format('DD-MM-YYYY')


							let formatedDateForFilter = moment(date).format('YYYY-MM-DD')

							const filteredAttendance = obj.attendances.filter(val => val.attendanceDate === formatedDateForFilter);

							if (filteredAttendance.length != 0) {
								dict[formatedDate] = 'W ( ' + filteredAttendance[0].totalHours + ' )' + 'B ( ' + filteredAttendance[0].totalBreakHours + ' ) ' + filteredAttendance[0].attendanceStatus
							}
							else {
								var presentStatus = 'Absent'
							for (let subIndex = 0; subIndex < leavesData.length; subIndex++) {
								if (formatedDateForFilter >= leavesData[subIndex].fromDateFormat && formatedDateForFilter <= leavesData[subIndex].toDateFormat) {
									if (leavesData[subIndex].request === "Full Day") {

										presentStatus = 'Leave'
									}
									

								}

							}
								dict[formatedDate] = 'W (0.00)' + 'B ( 0.00 ) ' + presentStatus
							}



							mondayStartDate = new Date(mondayStartDate.setDate(mondayStartDate.getDate() + 1));
						}

						attendance.push(dict)

					}

					console.log("attendancevalue",attendance)
					worksheet.addRows(attendance);

					res.setHeader(
						"Content-Type",
						"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
					);
					res.setHeader(
						"Content-Disposition",

						"attachment; filename=" + `attendance${reqObj.startDate} - ${reqObj.endDate}.xlsx`
					);
					return workbook.xlsx.write(res).then(function () {
						res.status(200).end();
					});
				})


			})
	}
	const download = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("request date is : " + reqObj.date);
		console.log(reqObj);
		console.log("request companyid is : " + reqObj.companyId);
		attendances
			.findAll({
				where: {
					dateOfAttendance: reqObj.date,
				},
				attributes: {
					exclude: [],
				},
				include: [
					{
						model: users,
						where: {
							companyId: reqObj.companyId,
						},
					},
				],
			})
			.then((userData) => {
				console.log(userData, "userData");
				let attendance = [];
				let slNo = 1;
				userData.forEach((obj) => {
					attendance.push({
						SNo: slNo,
						EmployeeCode: obj.user.employeeId,
						Name: obj.user.userName,
						inDuration: obj.totalHours,
						outDuration: obj.totalBreakHours,
						InTimeRecord: obj.inTime,
						OutTimeRecord: obj.outTime,
						AttendanceType:
							obj.attendanceType == "QR" &&
								obj.rescueadded == true
								? obj.attendanceType + " & Work from Home"
								: obj.attendanceType,
					});
					slNo = slNo + 1;
				});
				let workbook = new excel.Workbook();
				let worksheet = workbook.addWorksheet("Attendance");
				worksheet.columns = [
					{
						header: "SNo",
						key: "SNo",
						width: 5,
					},
					{
						header: "Employee Code",
						key: "EmployeeCode",
						width: 10,
					},
					{
						header: "Name",
						key: "Name",
						width: 25,
					},
					{
						header: "In Duration",
						key: "inDuration",
						width: 15,
					},
					{
						header: "Out Duration",
						key: "outDuration",
						width: 15,
					},
					{
						header: "InTime Record",
						key: "InTimeRecord",
						width: 15,
					},
					{
						header: "OutTime Record",
						key: "OutTimeRecord",
						width: 15,
					},
					{
						header: "Attendance Type",
						key: "AttendanceType",
						width: 25,
					},
				];
				worksheet.addRows(attendance);
				res.setHeader(
					"Content-Type",
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
				);
				res.setHeader(
					"Content-Disposition",

					"attachment; filename=" + `attendance ${reqObj.date}.xlsx`
				);
				return workbook.xlsx.write(res).then(function () {
					res.status(200).end();
				});
			});
	};
	const attendanceSearch = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		if (!reqObj.companyId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Company Id is required"
			);
		}

		if (reqObj.employeeId) {
			console.log("employee", reqObj.employeeId);

			var userdata = await users.findAll({
				where: {
					employeeId: reqObj.employeeId,
					isActive: true,
				},
			});
			console.log("userData", userdata);
			if (!userdata) {
				return helpers.appresponse(
					res,
					200,
					true,
					[],
					"no user found for the employee id."
				);
			}
			var length = userdata.length;
			var total = {};
			var present = [];
			for (var i = 0; i < length; i++) {
				var userDataId = await users.findOne({
					where: {
						id: userdata[i].id,
					},
					include: [
						{
							model: attendances,
						},
					],
				});
				console.log(
					"userDataId.attendance",
					userDataId.attendances.length
				);
				if (userDataId && userDataId.attendances.length > 0) {
					present.push(userDataId);
				}
			}
			total.present = present;
			total.absent = [];

			return helpers.appresponse(res, 200, true, total, "Success");
		} else {
			console.log("employee", reqObj.userName);
			let cond = {};
			cond["userName"] = {
				[Op.like]: "%" + reqObj.userName + "%",
			};
			cond["isActive"] = true;
			var userdata = await users.findAll({
				where: cond,
			});
			if (!userdata) {
				return helpers.appresponse(
					res,
					200,
					true,
					[],
					"no user found."
				);
			}
			var length = userdata.length;

			console.log(length, userdata.length);

			var total = {};

			var present = [];

			for (var i = 0; i < length; i++) {
				console.log("i value is to be : ", i);
				console.log("userdata[i]  ", userdata[i]);
				console.log("userdata[i].id: ", userdata[i].id);

				var userdatatwo = await users.findOne({
					where: {
						id: userdata[i].id,
					},
					include: [
						{
							model: attendances,
						},
					],
				});
				console.log(
					"userdatatwo.attendance",
					userdatatwo.attendances.length
				);
				if (userdatatwo && userdatatwo.attendances.length > 0) {
					present.push(userdatatwo);
				}
			}
			total.present = present;
			total.absent = [];

			return helpers.appresponse(res, 200, true, total, "Success");
		}
	};

	const attendanceManualEntry = async (req, res) => {
		var date = Date.now();

		const d = date;

		var today = moment(d).format("DD-MM-YYYY"); //

		const reqObj = helpers.getReqValues(req);

		console.log(reqObj);
		if (!reqObj.dateOfAttendance) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Date Of Attendance is required"
			);
		}

		if (reqObj.dateOfAttendance == today) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Given date is today's date."
			);
		}
		if (!reqObj.attendanceType) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Attendance Type is required."
			);
		}

		if (!reqObj.userId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"User Id is required"
			);
		}
		var attendancesdata = await attendances.findOne({
			where: {
				dateOfAttendance: reqObj.dateOfAttendance,
				userId: reqObj.userId,
			},
		});

		if (attendancesdata) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"already attendance is added for the given date."
			);
		}

		var usersdata = await users.findOne({
			where: {
				id: reqObj.userId,
			},
		});
		if (!usersdata) {
			return helpers.appresponse(res, 404, false, [], "User not found .");
		}
		var companydata = await companies.findOne({
			where: {
				id: usersdata.companyId,
			},
		});
		console.log("company data is :", companydata);
		if (reqObj && reqObj.attendanceType == "manual") {
			var totalhours = checktimedifference(reqObj.inTime, reqObj.outTime);
			console.log("total _)_)_)_)_)_))_ ", totalhours);

			const dateArray = reqObj.dateOfAttendance.split('-');

			var checkFromDate = new Date(
				parseInt(dateArray[2]),
				parseInt(dateArray[1]) - 1,
				parseInt(dateArray[0]),
			);
			var arrayodtime = totalhours.split(":");
			console.log("arrayodtime is " + arrayodtime);
			var timeinthour = parseInt(arrayodtime[0]);
			console.log("timeinthour is " + timeinthour);
			var attendancestatus = "Absent";
			if (timeinthour >= companydata.halfDayTime) {
				attendancestatus = "Half day";
			}
			if (timeinthour >= companydata.fullDayTiming) {
				attendancestatus = "Present";
			}
			attendances
				.create({
					outTime: reqObj.outTime,
					inTime: reqObj.inTime,
					userId: reqObj.userId,
					dateOfAttendance: reqObj.dateOfAttendance,
					attendanceDate: checkFromDate,
					isActive: false,
					firstOut: false,
					status: "out",
					totalHours: totalhours,
					attendanceStatus: attendancestatus,
					breakhour: "00:00",
					attendanceType: "manual",
					createdAt: Date.now(),
					updateddAt: Date.now(),
				})
				.then((attendancesData) => {
					return helpers.appresponse(
						res,
						200,
						true,
						attendancesData,
						"attendance added successfully"
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


	const getAttendanceBetweenTwoDate = async (req, res) => {

		const reqObj = helpers.getReqValues(req);
		if (!reqObj.startDate) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Start date is required"
			);

		}
		if (!reqObj.endDate) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"End date is required"
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
		var mondayFormated = moment(reqObj.startDate).format('YYYY-MM-DD')
		var fridayFormated = moment(reqObj.endDate).format('YYYY-MM-DD')

		users
			.findAll({
				where: {
					email: {
						$notIn: ["stevej.india@gmail.com"],
					},
					companyId: reqObj.companyId,
					onShore: false,
					isActive: true
				},

				attributes: {
					exclude: ["password", "userOtp"],
				},
				// include: [
				// 	{
				// 		model: attendances,
				// 		where: {
				// 			attendanceDate: {
				// 				$between: [mondayFormated, fridayFormated]
				// 			},
				// 		}
				// 	},
				// ],
			})
			.then(async (userData) => {

				console.log("userdate", userData)


				users.findAll({
					where: {
						email: {
							$notIn: ["stevej.india@gmail.com"],
						},
						onShore: false,
						isActive: false
					},
					attributes: {
						exclude: ["password", "userOtp"],
					},
					include: [
						{
							model: attendances,
							where: {
								attendanceDate: {
									$between: [mondayFormated, fridayFormated]
								},
							}
						},
					],
				}).then(async (InActiveuserData) => {

					console.log("InActiveuserData", InActiveuserData)

					let result = userData.concat(InActiveuserData)

					return helpers.appresponse(
						res,
						200,
						true,
						result,
						"success"
					);
				})







			})

	}


	const getSingleUserAttendanceBetweenDates = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		if (!reqObj.start) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Start date is required"
			);

		}
		if (!reqObj.end) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"End date is required"
			);
		}
		if (!reqObj.userId) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"user Id is required"
			);
		}

		var mondayFormated = moment(reqObj.start).format('YYYY-MM-DD')
		var fridayFormated = moment(reqObj.end).format('YYYY-MM-DD')

		var mailMondayFromated = moment(reqObj.start).format('DD-MMM-YYYY')
		var mailFridayFromated = moment(reqObj.end).format('DD-MMM-YYYY')

		var mailFullMondayFormated = moment(reqObj.start).format('DD-MMM-YYYY')
		var mailFullFridayFromated = moment(reqObj.end).format('DD-MMM-YYYY')


		let whereObj = {}
		let whereAttendanceObj = {}
		whereObj = {
			email: {
				$notIn: ["stevej.india@gmail.com"],
			},
			isActive: true,
			onShore: false,
			id: reqObj.userId
		},

			whereAttendanceObj = {
				attendanceDate: {
					$between: [mondayFormated, fridayFormated]
				},
				userId: reqObj.userId
			}


		users
			.findAll({
				where: whereObj,

				attributes: {
					exclude: ["password", "userOtp"],
				},
				include: [
					{
						model: attendances,
						where: whereAttendanceObj
					},
				],
			})
			.then(async (userData) => {


				let leavesData = await leaves.findAll({
					where: {
						userId: reqObj.userId,
						fromDateFormat: {
							$between: [mondayFormated, fridayFormated]
						},

					}
				})


				if (userData.length === 0) {

					users
						.findAll({
							where: {
								email: {
									$notIn: ["stevej.india@gmail.com"],
								},
								id: reqObj.userId,
								onShore: false,
								isActive: false
							},

							attributes: {
								exclude: ["password", "userOtp"],
							},
							include: [
								{
									model: attendances,
									where: whereAttendanceObj
								},
							],
						})
						.then(async (userInactiveData) => {

							if (userInactiveData == 0) {




								let mondayDate = new Date(mondayFormated)
								let fridayDAte = new Date(fridayFormated)
								const leaveRes = await utilsService.leavesDataCheck(leavesData)

								console.log("leave", leaveRes)
								const workSummaryArray = await utilsService.workSummary(userInactiveData, mondayDate, fridayDAte, leavesData)
								console.log("worksummary", workSummaryArray[0])

								leaveRes.totalWorkingHours = '0.0'
								leaveRes.totalBreakHours = '0.0'

								response.workFromHours = '0.0'

								workSummaryArray[0].sort(function (a, b) {
									//console.log("a.date",a.date)
									var A = a.date.split("-");
									var B = b.date.split("-");
									var strA = [A[2], A[1], A[0]].join("/");
									var strB = [B[2], B[1], B[0]].join("/");
									return strA.localeCompare(strB);
								});

								leaveRes.attendance = workSummaryArray[0]
								return helpers.appresponse(
									res,
									200,
									true,
									leaveRes,
									"success"
								);






								// })
							}
							else {

								let mondayDate = new Date(mondayFormated)
								let fridayDAte = new Date(fridayFormated)
								console.log("userInactiveData",userInactiveData)
								const leaveRes = await utilsService.leavesDataCheck(leavesData)

								const attendanceArray = await utilsService.workAttendanceArraySummary(userInactiveData[0],leavesData)
								const workSummaryArray = await utilsService.workSummary(attendanceArray[0], mondayDate, fridayDAte, leavesData)
									
								var overAllWorkingMins = attendanceArray[1]
								var overAllBreakMins = attendanceArray[2]
								var workFromHomHours = attendanceArray[3]
								const finalArray = attendanceArray[0].concat(workSummaryArray[0])

								finalArray.sort(function (a, b) {
									//console.log("a.date",a.date)
									var A = a.date.split("-");
									var B = b.date.split("-");
									var strA = [A[2], A[1], A[0]].join("/");
									var strB = [B[2], B[1], B[0]].join("/");
									return strA.localeCompare(strB);
								});
								console.log("finalArray", finalArray)


								if (overAllWorkingMins > 0) {
									var minutes = overAllWorkingMins % 60;
									var hours = (overAllWorkingMins - minutes) / 60;
									console.log("hoursss", hours)
									var convertedTotalHrs = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' + minutes : minutes);
			
									var break_minutes = overAllBreakMins % 60;
									var break_hours = (overAllBreakMins - break_minutes) / 60;
									console.log("break_hours", break_hours)
									var convertedBreakHours = (break_hours < 10 ? '0' : '') + break_hours + ':' + (break_minutes < 10 ? '0' + break_minutes : break_minutes);
			
			
									var convertedWorkFromHours = '0:00'
									if (workFromHomHours > 0) {
										var work_from_minutes = workFromHomHours % 60;
										var work_from_hours = (workFromHomHours - work_from_minutes) / 60;
										convertedWorkFromHours = (work_from_hours < 10 ? '0' : '') + work_from_hours + ':' + (work_from_minutes < 10 ? '0' + work_from_minutes : work_from_minutes);
									}

									leaveRes.totalWorkingHours = convertedTotalHrs.toString()
									leaveRes.totalBreakHours = convertedBreakHours.toString()
								
									leaveRes.workFromHours = convertedWorkFromHours.toString()
								
									leaveRes.attendance = finalArray

									return helpers.appresponse(
										res,
										200,
										true,
										leaveRes,
										"success"
									);
								}
							}


						})
				}
				else{
				//	console.log("userdaata",userData[0])

					let mondayDate = new Date(mondayFormated)
					let fridayDAte = new Date(fridayFormated)
					//console.log("userInactiveData",userData)
					const leaveRes = await utilsService.leavesDataCheck(leavesData)

					const attendanceArray = await utilsService.workAttendanceArraySummary(userData[0],leavesData)
					const workSummaryArray = await utilsService.workSummary(attendanceArray[0], mondayDate, fridayDAte, leavesData)
						
					var overAllWorkingMins = attendanceArray[1]
					var overAllBreakMins = attendanceArray[2]
					var workFromHomHours = attendanceArray[3]
					const finalArray = attendanceArray[0].concat(workSummaryArray[0])

					finalArray.sort(function (a, b) {
						//console.log("a.date",a.date)
						var A = a.date.split("-");
						var B = b.date.split("-");
						var strA = [A[2], A[1], A[0]].join("/");
						var strB = [B[2], B[1], B[0]].join("/");
						return strA.localeCompare(strB);
					});
					console.log("finalArray", finalArray)

					if (overAllWorkingMins > 0) {
						var minutes = overAllWorkingMins % 60;
						var hours = (overAllWorkingMins - minutes) / 60;
						console.log("hoursss", hours)
						var convertedTotalHrs = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' + minutes : minutes);

						var break_minutes = overAllBreakMins % 60;
						var break_hours = (overAllBreakMins - break_minutes) / 60;
						console.log("break_hours", break_hours)
						var convertedBreakHours = (break_hours < 10 ? '0' : '') + break_hours + ':' + (break_minutes < 10 ? '0' + break_minutes : break_minutes);


						var convertedWorkFromHours = '0:00'
						if (workFromHomHours > 0) {
							var work_from_minutes = workFromHomHours % 60;
							var work_from_hours = (workFromHomHours - work_from_minutes) / 60;
							convertedWorkFromHours = (work_from_hours < 10 ? '0' : '') + work_from_hours + ':' + (work_from_minutes < 10 ? '0' + work_from_minutes : work_from_minutes);
						}

						leaveRes.totalWorkingHours = convertedTotalHrs.toString()
						leaveRes.totalBreakHours = convertedBreakHours.toString()
					
						leaveRes.workFromHours = convertedWorkFromHours.toString()
					
						leaveRes.attendance = finalArray

						return helpers.appresponse(
							res,
							200,
							true,
							leaveRes,
							"success"
						);
					}
				}


			})

	}

	const getHoursBasedOnDate = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		if (!reqObj.start) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Start date is required"
			);

		}
		if (!reqObj.end) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"End date is required"
			);
		}

		let whereObj = {}
		let whereAttendanceObj = {}



		var mondayFormated = moment(reqObj.start).format('YYYY-MM-DD')
		var fridayFormated = moment(reqObj.end).format('YYYY-MM-DD')

		var mailMondayFromated = moment(reqObj.start).format('DD-MMM-YYYY')
		var mailFridayFromated = moment(reqObj.end).format('DD-MMM-YYYY')

		var mailFullMondayFormated = moment(reqObj.start).format('DD-MMM-YYYY')
		var mailFullFridayFromated = moment(reqObj.end).format('DD-MMM-YYYY')
		console.log("monday ", mondayFormated)
		console.log("fridayFormated ", fridayFormated)
		if (reqObj.userId) {
			whereObj = {
				email: {
					$notIn: ["stevej.india@gmail.com"],
				},
				isActive: true,
				onShore: false,
				id: reqObj.userId
			},

				whereAttendanceObj = {
					attendanceDate: {
						$between: [mondayFormated, fridayFormated]
					},
					userId: reqObj.userId
				}

		}
		else {
			whereObj = {
				email: {
					$notIn: ["stevej.india@gmail.com"],
				},
				onShore: false,
				isActive: true
			}

			whereAttendanceObj = {
				attendanceDate: {
					$between: [mondayFormated, fridayFormated]
				},

			}
		}






		users
			.findAll({
				where: whereObj,

				attributes: {
					exclude: ["password", "userOtp"],
				},
				include: [
					{
						model: attendances,
						where: whereAttendanceObj
					},
				],
			})
			.then(async (userData) => {

				if (!reqObj.userId) {

					//utilsService.sendMailToNonAttendanceUser(userData,mondayFormated,fridayFormated,mailFullMondayFormated,mailFullFridayFromated,mailMondayFromated,mailFridayFromated)
				}

				if (userData.length === 0) {
					return helpers.appresponse(
						res,
						404,
						false,
						{},
						"No attendance found"
					);
				}



				console.log("userData", userData)


				userData.forEach(async (userSingleObj, index) => {



					let leavesData = await leaves.findAll({
						where: {
							userId: userSingleObj.id,
							fromDateFormat: {
								$between: [mondayFormated, fridayFormated]
							},

						}
					})

					console.log("leavesDataArray", leavesData)


					var fulldayCount = 0
					var halfdayCount = 0
					var fulldayLeaveHours = 0
					var halfdayLeaveHours = 0
					var permissionHours = 0.0
					var permissionCount = 0
					var workFromHomHours = 0
					var workFromHomeHoursCount = 0

					var leavesDateArray = []
					for (let index = 0; index < leavesData.length; index++) {

						console.log("obj", leavesData[index])
						if (leavesData[index].request === "Full Day") {
							fulldayCount = fulldayCount + 1
							fulldayLeaveHours = fulldayLeaveHours + 8
							// fulldayLeaveHours = fulldayLeaveHours.toFixed(2)

						}
						else if (leavesData[index].request === "Half Day") {
							halfdayCount = halfdayCount + 1
							halfdayLeaveHours = halfdayLeaveHours + 4
							// halfdayLeaveHours= halfdayLeaveHours.toFixed(2)
						}
						else if (leavesData[index].request === "Permission") {

							permissionCount = permissionCount + 1

						}
						else if (leavesData[index].request === "Work from Home") {
							workFromHomeHoursCount = workFromHomeHoursCount + 1

						}
					}
					var response = {};
					response.halfdayCount = halfdayCount
					response.fulldayCount = fulldayCount
					response.fulldayLeaveHours = fulldayLeaveHours
					response.halfdayLeaveHours = halfdayLeaveHours
					//response.permissionHours
					let attendance = [];

					let overAllWorkingMins = 0
					let overAllBreakMins = 0
					let mailTable = userSingleObj.email + " " + userSingleObj.employeeId + " " + '<table><TABLE BORDER=”2″><thead><td><b>Day</b></td><td><b>Work Hours</b></td><td><b>Break Hours</b></td></thead>';
					let mailTable2 = '<table style="width: 600px;margin: 0 auto;min-width: 600px;background: #f9f9f9;padding: 26px 20px 50px;font-family: arial;border-radius:4px;"cellpadding = "0" cellspacing = "0"><tbody><tr><td style="width: 100%;text-align: center;padding-bottom: 40px;"><div><img src="https://www.greatinnovus.com/blogs/wp-content/uploads/2022/01/GI_newcolor.png" width="225" style="padding-top: 10px;"></div></td></tr><tr><td><table style="width: 100%;margin-bottom: 15px;"><tr><td style="width: 407px;"><div><b style="float: left;padding-right: 6px;">Name :</b><div>' + userSingleObj.userName + '</div></div></td><td><div><b style="float: left;padding-right: 6px;">Employee ID :</b><div>' + userSingleObj.employeeId + '</div></div></td></tr></table></td> </tr><tr><td><table style="width: 100%;margin-bottom: 15px;"><tr><td><div><b style="float: left;padding-right: 6px;">Report Date :</b><div>' + mailFullMondayFormated + ' to ' + mailFullFridayFromated + '</div></div></td></tr></table></td></tr><tr><td><table style="width:100%;"><tr><td><table style="width:100%;border-collapse: collapse;border: 1px solid;"><tr><th style="border: 1px solid #000;padding: 2px 6px;background: #5ca529;color: #fff;font-weight: normal;">Day</th><th style="border: 1px solid #000;padding: 2px 6px;background: #5ca529;color: #fff;font-weight: normal;">Work Hours</th> <th style="border: 1px solid #000;padding: 2px 6px;background: #5ca529;color: #fff;font-weight: normal;">Break Hours</th><th style="border: 1px solid #000;padding: 2px 6px;background: #5ca529;color: #fff;font-weight: normal;">Status</th><th style="border: 1px solid #000;padding: 2px 6px;background: #5ca529;color: #fff;font-weight: normal;">Work Form</th></tr>'

					for (let index = 0; index < userSingleObj.attendances.length; index++) {


						var presentStatus = 'Present'
						for (let subIndex = 0; subIndex < leavesData.length; subIndex++) {
							if (userSingleObj.attendances[index].attendanceDate >= leavesData[subIndex].fromDateFormat && userSingleObj.attendances[index].attendanceDate <= leavesData[subIndex].toDateFormat) {
								if (leavesData[index].request === "Half Day") {

									presentStatus = 'Present + H'
								}
								else if (leavesData[index].request === "Permission") {
									presentStatus = 'Present + P'
								}
							}
						}
						console.log("userSingleObj.attendance", userSingleObj.attendances)
						let attendanceObj = userSingleObj.attendances[index]
						let convertedMins = parseInt(moment.duration(attendanceObj.totalHours).asMinutes())

						const leaveDataObj = leavesData.filter(val => val.fromDateFormat)
						overAllWorkingMins += convertedMins

						if (attendanceObj.attendanceType === "Work from Home") {
							workFromHomHours += convertedMins
						}


						var statusColor = 'green'

						if (convertedMins >= 600) {
							statusColor = 'orange'
						}
						else if (convertedMins < 480) {
							statusColor = 'red'
						}
						mailTable += '<tr><td style="background-color:red">' + attendanceObj.dateOfAttendance + '</td><td>' + attendanceObj.totalHours + '</td><td>' + attendanceObj.totalBreakHours + '</td></tr>';

						let convertedBreakMins = parseInt(moment.duration(attendanceObj.totalBreakHours).asMinutes())
						overAllBreakMins += convertedBreakMins

						var breakStatusColor = ''
						if (convertedBreakMins < 60) {
							breakStatusColor = 'red'
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
							workFrom: attendanceObj.attendanceType == 'QR' ? "Office" : "Home"

						});





					}

					let mondayFormatedCount = new Date(mondayFormated).getDate()

					let mondayMonthFormated = new Date(mondayFormated).getMonth()
					let mondayFormatedYear = new Date(mondayFormated).getFullYear()

					let fridayFormatedDate = new Date(fridayFormated).getDate()

					console.log('mondayFormatedCount', attendance.length)



					let totalDays = 0

					let mondayDate = new Date(mondayFormated)
					let fridayDAte = new Date(fridayFormated)

					console.log('mondayDate', mondayDate)

					console.log('fridayDAte', fridayDAte)

					while (mondayDate <= fridayDAte) {

						var mm = ((mondayDate.getMonth() + 1) >= 10) ? (mondayDate.getMonth() + 1) : '0' + (mondayDate.getMonth() + 1);
						var dd = ((mondayDate.getDate()) >= 10) ? (mondayDate.getDate()) : '0' + (mondayDate.getDate());
						var yyyy = mondayDate.getFullYear();
						//var date = dd+"-"+mm+"-"+yyyy; //yyyy-mm-dd

						//console.log("dasyyyy",date)

						//date increase by 1
						// }
						// for (let index = mondayFormatedCount; index <= fridayFormatedDate; index++) {

						let date = new Date(yyyy, mm - 1, dd)

						let day = date.getDay()
						if (day != 6 && day != 0) {
							totalDays = totalDays + 1
						}
						//console.log("dayvalue", day)
						let formatedDate = moment(date).format('DD-MM-YYYY')
						let formatedDateCheck = moment(date).format('YYYY-MM-DD')

						//console.log("formatedDate", formatedDate)
						const filteredAttendance = attendance.filter(val => val.date === formatedDate);

						//console.log("filteredAttendance", filteredAttendance.length)




						if (filteredAttendance.length == 0) {
							var presentStatus = 'Absent'
							for (let subIndex = 0; subIndex < leavesData.length; subIndex++) {
								if (formatedDateCheck >= leavesData[subIndex].fromDateFormat && formatedDateCheck <= leavesData[subIndex].toDateFormat) {
									if (leavesData[subIndex].request === "Full Day") {

										presentStatus = 'Leave'
									}

								}

							}

							attendance.push({

								date: formatedDate,
								workHours: "-",
								breakHours: "-",
								inTime: "",
								outTime: "",
								status: presentStatus,
								statusColor: '',
								breakStatusColor: '',
								workFrom: "-"

							});
						}
						//mondayFormatedCount = mondayFormatedCount + 1
						mondayDate = new Date(mondayDate.setDate(mondayDate.getDate() + 1));
					}
					//	console.log('attendanceArray', attendance)
					// attendance.sort(function (a, b) {
					// 	var keyA = a.date,
					// 		keyB = b.date;
					// 	console.log(keyA, keyB)
					// 	// Compare the 2 dates
					// 	if (keyA < keyB) return -1;
					// 	if (keyA > keyB) return 1;
					// 	return 0;
					// });


					attendance.sort(function (a, b) {
						var A = a.date.split("-");
						var B = b.date.split("-");
						var strA = [A[2], A[1], A[0]].join("/");
						var strB = [B[2], B[1], B[0]].join("/");
						return strA.localeCompare(strB);
					});


					for (let index = 0; index < attendance.length; index++) {


						if (attendance[index].statusColor == 'red') {
							console.log("reddcalled")
							if (attendance[index].breakStatusColor == 'red') {
								mailTable2 += '<tr><td style="border: 1px solid;padding: 2px 6px;text-align: center;">' + attendance[index].date + '</td><td style="border: 1px solid;padding: 2px 6px;background-color:red;color:white;text-align: center;">' + attendance[index].workHours + '</td><td style="border: 1px solid;padding: 2px 6px;text-align: center;background-color:red;color:white;text-align: center;">' + attendance[index].breakHours + '</td><td style="border: 1px solid;padding: 2px 6px;">' + attendance[index].status + '</td><td style="border: 1px solid;padding: 2px 6px;">' + attendance[index].workFrom + '</td></tr>'
							}
							else {
								mailTable2 += '<tr><td style="border: 1px solid;padding: 2px 6px;text-align: center;">' + attendance[index].date + '</td><td style="border: 1px solid;padding: 2px 6px;background-color:red;color:white;text-align: center;">' + attendance[index].workHours + '</td><td style="border: 1px solid;padding: 2px 6px;text-align: center;">' + attendance[index].breakHours + '</td><td style="border: 1px solid;padding: 2px 6px;">' + attendance[index].status + '</td><td style="border: 1px solid;padding: 2px 6px;">' + attendance[index].workFrom + '</td></tr>'
							}

						}
						else if (attendance[index].statusColor == 'orange') {

							if (attendance[index].breakStatusColor == 'red') {
								mailTable2 += '<tr><td style="border: 1px solid;padding: 2px 6px;text-align: center;">' + attendance[index].date + '</td><td style="border: 1px solid;padding: 2px 6px;background-color:orange;color:white;text-align: center;">' + attendance[index].workHours + '</td><td style="border: 1px solid;padding: 2px 6px;text-align: center;background-color:red;color:white;text-align: center;">' + attendance[index].breakHours + '</td><td style="border: 1px solid;padding: 2px 6px;">' + attendance[index].status + '</td><td style="border: 1px solid;padding: 2px 6px;">' + attendance[index].workFrom + '</td></tr>'
							}
							else {
								mailTable2 += '<tr><td style="border: 1px solid;padding: 2px 6px;text-align: center;">' + attendance[index].date + '</td><td style="border: 1px solid;padding: 2px 6px;background-color:orange;color:white;text-align: center;">' + attendance[index].workHours + '</td><td style="border: 1px solid;padding: 2px 6px;text-align: center;">' + attendance[index].breakHours + '</td><td style="border: 1px solid;padding: 2px 6px;">' + attendance[index].status + '</td><td style="border: 1px solid;padding: 2px 6px;">' + attendance[index].workFrom + '</td></tr>'
							}

						}
						else {

							if (attendance[index].breakStatusColor == 'red') {

								mailTable2 += '<tr><td style="border: 1px solid;padding: 2px 6px;text-align: center;">' + attendance[index].date + '</td><td style="border: 1px solid;padding: 2px 6px;text-align: center;">' + attendance[index].workHours + '</td><td style="border: 1px solid;padding: 2px 6px;text-align: center;background-color:red;color:white;text-align: center;">' + attendance[index].breakHours + '</td><td style="border: 1px solid;padding: 2px 6px;">' + attendance[index].status + '</td><td style="border: 1px solid;padding: 2px 6px;">' + attendance[index].workFrom + '</td></tr>'
							}
							else {
								mailTable2 += '<tr><td style="border: 1px solid;padding: 2px 6px;text-align: center;">' + attendance[index].date + '</td><td style="border: 1px solid;padding: 2px 6px;text-align: center;">' + attendance[index].workHours + '</td><td style="border: 1px solid;padding: 2px 6px;text-align: center;">' + attendance[index].breakHours + '</td><td style="border: 1px solid;padding: 2px 6px;">' + attendance[index].status + '</td><td style="border: 1px solid;padding: 2px 6px;">' + attendance[index].workFrom + '</td></tr>'
							}
						}

					}
					mailTable2 += '</table></td></tr></table></td></tr>'
					// for(let index = 0 ; index < attendance.length ; index++)
					// {

					// 	let date = new Date(mondayFormatedYear,mondayMonthFormated,mondayFormatedCount)
					// 	console.log("new date",date)
					// 	let formatedDate = moment(date).format('DD-MM-YYYY')
					// 	console.log("formatedDate",formatedDate)
					// 	if(attendance[index].date == formatedDate)
					// 	{

					// 		console.log("if called")
					// 	}
					// 	else{

					// 	}
					// 	mondayFormatedCount = mondayFormatedCount + 1
					// }


					let workbook = new excel.Workbook();
					let worksheet = workbook.addWorksheet("Attendance");
					// worksheet.mergeCells('A1', 'D2');
					worksheet.getCell('A1').value = "Name: " + userSingleObj.userName
					worksheet.getCell('D1').value = "Employee ID: " + userSingleObj.employeeId
					worksheet.getCell('A3').value = "Report Date: " + mailMondayFromated + " to " + mailFridayFromated
					worksheet.getRow(1).font = { bold: true };

					worksheet.getRow(4)
					worksheet.getRow(4).font = { color: { argb: "FFFFFF" }, bold: true, };
					// worksheet.getRow(4).fill = {  patternType: "solid",
					// fgColor: { rgb: "6d9eeb" }};
					worksheet.getRow(4).values = ['Day', 'Work Hours', 'Break Hours', 'workFrom'];
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
									type: 'pattern',
									pattern: 'solid',
									fgColor: { argb: '6d9eeb' }
								};
							};
							if (rowNumber > 4 && colNumber == 3 || rowNumber > 4 && colNumber == 4 || rowNumber > 4 && colNumber == 2 || rowNumber > 4 && colNumber == 1) {
								cell.font = {
									bold: true
								}
							}
							// Set border of each cell 
							cell.border = {
								top: { style: 'thin' },
								left: { style: 'thin' },
								bottom: { style: 'thin' },
								right: { style: 'thin' }
							};
						})
						//Commit the changed row to the stream
						row.commit();
					});

					const buffer = await workbook.xlsx.writeBuffer();
					mailTable += '</table>';



					console.log("weekely work hours", userSingleObj.email, overAllWorkingMins)
					console.log("mailtable", mailTable)

					var fullDays = fulldayCount > 0 ? `${fulldayCount} Days` : `${fulldayCount} Day`
					var halfdays = halfdayCount > 0 ? `${halfdayCount} Days` : `${halfdayCount} Day`
					var workFromDays = workFromHomeHoursCount > 0 ? `${workFromHomeHoursCount} Days` : `${workFromHomeHoursCount} Day`

					var fulldayHoursInFloat = fulldayLeaveHours.toFixed(2)
					var halfdayHoursInFloat = halfdayLeaveHours.toFixed(2)
					var actualWorkHours = (totalDays * 8)
					response.actualWorkHours = actualWorkHours
					if (overAllWorkingMins > 0) {
						var minutes = overAllWorkingMins % 60;
						var hours = (overAllWorkingMins - minutes) / 60;
						console.log("hoursss", hours)
						var convertedTotalHrs = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' + minutes : minutes);

						var break_minutes = overAllBreakMins % 60;
						var break_hours = (overAllBreakMins - break_minutes) / 60;
						console.log("break_hours", break_hours)
						var convertedBreakHours = (break_hours < 10 ? '0' : '') + break_hours + ':' + (break_minutes < 10 ? '0' + break_minutes : break_minutes);


						var convertedWorkFromHours = '0:00'
						if (workFromHomHours > 0) {
							var work_from_minutes = workFromHomHours % 60;
							var work_from_hours = (workFromHomHours - work_from_minutes) / 60;
							convertedWorkFromHours = (work_from_hours < 10 ? '0' : '') + work_from_hours + ':' + (work_from_minutes < 10 ? '0' + work_from_minutes : work_from_minutes);
						}
						console.log("workFromHomHours", workFromHomHours)

						console.log("convertedTotalBreakHrs_Month-->", convertedBreakHours);
						console.log("convertedTotalHrs-->", convertedTotalHrs);


						//console.log("tyepfof ",typeof(convertedBreakHours))

						var halfDayHoursLeadingStr = halfdayHoursInFloat
						var fullDayHoursLeadingStr = fulldayHoursInFloat
						if (halfdayHoursInFloat < 10.0) {
							halfDayHoursLeadingStr = '0' + halfdayHoursInFloat

						}
						if (fulldayHoursInFloat < 10.0) {
							fullDayHoursLeadingStr = '0' + fulldayHoursInFloat

						}

						mailTable2 += '<tr><td><table style="width:100%;margin-top: 20px;"><tr><td><div style="font-weight: bold;padding-bottom:10px">Summary</div>'
						mailTable2 += '<div style="padding-bottom:10px;display:block;padding-bottom:12px;height: 14px;"><div style="float: left;width:140px">Actual hours</div><div style="float: left;font-weight: bold;">: ' + actualWorkHours + '</div></div>'
						mailTable2 += '<div style="margin-bottom:10px;display: block;height: 14px;clear: both;"><div style="float: left;width:140px">Work hours</div><div style="float: left;font-weight: bold;">: ' + convertedTotalHrs + '</div></div>'
						mailTable2 += '<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Break hours</div><div style="float: left;">: ' + convertedBreakHours + '</div></div>'
						mailTable2 += '<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Full Leave hours</div><div style="float: left;">: ' + fullDayHoursLeadingStr + " ( " + fullDays + " )" + '</div></div>'
						mailTable2 += '<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Half Day Leave hours</div><div style="float: left;">: ' + halfDayHoursLeadingStr + " ( " + halfdays + " )" + '</div></div>'
						mailTable2 += '<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Permission Count</div><div style="float: left;">: ' + permissionCount + '</div></div>'
						mailTable2 += '<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Work from home hours</div><div style="float: left;">: ' + convertedWorkFromHours + " ( " + workFromDays + " )" + '</div></div>'

						response.totalWorkingHours = convertedTotalHrs
						response.totalBreakHours = convertedBreakHours
						response.permissionCount = permissionCount
						response.workFromHours = convertedWorkFromHours
						response.workFromHOmeCount = workFromDays
						mailTable += 'Actual  Hours : <b> 40:00</b>' + '<br>'
						mailTable += 'Total Work Hours : <b>' + convertedTotalHrs + '</b><br>'
						mailTable += 'Total Break Hours : <b>' + convertedBreakHours + '</b><br>'
						mailTable += 'Full day Leave hours : <b>' + fulldayLeaveHours + "( " + fulldayCount + ") Days" + '</b><br>'
						mailTable += 'Half day leave hours : <b>' + halfdayLeaveHours + "( " + halfdayCount + ") Days" + '</b><br>'

						mailTable += 'Permission Hours : <b>' + permissionHours + "( " + permissionCount + ") Days" + '</b><br>'
						mailTable += 'Work From Home Hours : <b>' + convertedWorkFromHours + "( " + workFromHomeHoursCount + ") Days" + '</b><br>'

					}
					else {


						var convertedWorkFromHours = '0:00'
						if (workFromHomHours > 0) {
							var work_from_minutes = workFromHomHours % 60;
							var work_from_hours = (overAllBreakMins - work_from_minutes) / 60;
							convertedWorkFromHours = work_from_hours + ':' + (work_from_minutes < 10 ? '0' + work_from_minutes : work_from_minutes);
						}
						var halfDayHoursLeadingStr = halfdayHoursInFloat
						var fullDayHoursLeadingStr = fulldayHoursInFloat
						if (halfdayHoursInFloat < 10.0) {
							halfDayHoursLeadingStr = '0' + halfdayHoursInFloat

						}
						if (fulldayHoursInFloat < 10.0) {
							fullDayHoursLeadingStr = '0' + fulldayHoursInFloat

						}

						mailTable2 += '<tr><td><table style="width:100%;margin-top: 20px;"><tr><td><div style="font-weight: bold;padding-bottom:10px">Summary</div>'
						mailTable2 += '<div style="padding-bottom:10px;display:block;padding-bottom:12px;height: 14px;"><div style="float: left;width:140px">Actual hours</div><div style="float: left;font-weight: bold;">: ' + actualWorkHours + '</div></div>'
						mailTable2 += '<div style="margin-bottom:10px;display: block;height: 14px;clear: both;"><div style="float: left;width:140px">Work hours</div><div style="float: left;font-weight: bold;">: ' + '00.00' + '</div></div>'
						mailTable2 += '<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Break hours</div><div style="float: left;">: ' + '00.00' + '</div></div>'
						mailTable2 += '<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Full Leave hours</div><div style="float: left;">: ' + fullDayHoursLeadingStr + " ( " + fullDays + " )" + '</div></div>'
						mailTable2 += '<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Half Day Leave hours</div><div style="float: left;">: ' + halfDayHoursLeadingStr + " ( " + halfdays + " )" + '</div></div>'
						mailTable2 += '<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Permission Count</div><div style="float: left;">: ' + permissionCount + '</div></div>'
						mailTable2 += '<div style="margin-bottom:10px;display: block;clear: both;height: 14px;"><div style="float: left;width:140px">Work from home hours</div><div style="float: left;">: ' + convertedWorkFromHours + " ( " + workFromDays + " )" + '</div></div>'
						response.totalWorkingHours = "0.0"
						response.totalBreakHours = '0.0'
						response.permissionCount = permissionCount
						response.workFromHours = convertedWorkFromHours
						response.workFromHOmeCount = workFromDays
						mailTable += 'Actual  Hours : <b> 40:00</b>' + '<br>'
						mailTable += 'Total Work Hours : <b>' + "00.00" + '</b><br>'
						mailTable += 'Total Break Hours : <b>' + '00.00' + '</b><br>'
						mailTable += 'Full day Leave hours : <b>' + fulldayLeaveHours + "( " + fulldayCount + ") Days" + '</b><br>'
						mailTable += 'Half day leave hours : <b>' + halfdayLeaveHours + "( " + halfdayCount + ") Days" + '</b><br>'

						mailTable += 'Permission Hours : <b>' + permissionCount + '</b><br>'
						mailTable += 'Work From Home Hours : <b>' + convertedWorkFromHours + "( " + workFromHomeHoursCount + ") Days" + '</b><br>'
					}


					mailTable2 += '</td></tr></table></td></tr></tbody></table>'

					response.attendance = attendance



					// if (!reqObj.userId) {
					// 	const path = `${config.uploadPath}/attendanceSummary/attendance ${userSingleObj.userName} ( ${userSingleObj.employeeId} ) - ${mailMondayFromated} to ${mailFridayFromated}.xlsx`;

					// fs.createWriteStream(path).write(buffer);
					// setTimeout(() => {
					// 	utilsService.sendWeeklyMail(userSingleObj.email, mailMondayFromated, mailFridayFromated, userSingleObj, buffer, mailTable2)
					// }, 1000 * index);

					// }






					if (reqObj.userId) {
						return helpers.appresponse(
							res,
							200,
							true,
							response,
							"success"
						);
					}
					// else {
					// return helpers.appresponse(
					// 	res,
					// 	200,
					// 	true,
					// 	[],
					// 	"success"
					// );
					// }




				})





			}).catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});

	}

	const getOverallTotalHrsForUser = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("request date is : " + reqObj.date);
		console.log("request companyid is : " + reqObj.companyId);
		var response = {};

		users
			.findAll({
				where: {
					email: {
						$notIn: ["hrm@greatinnovus.com"],
					},
					companyId: reqObj.companyId,
				},

				attributes: {
					exclude: ["password", "userOtp"],
				},
				include: [
					{
						model: attendances,
					},
				],
			})
			.then((userData) => {
				if (userData) {
					// console.log("USERDATA-->", JSON.stringify(userData));

					let monthData = [];
					let month_overAllWorkingMins = 0;
					let month_overAllBreakMins = 0;

					userData.forEach((obj) => {
						let overAllWorkingMins = 0;
						let overAllBreakMins = 0;

						for (let i = 0; i < obj.attendances.length; i++) {
							// let monthOnly = moment(new Date(obj.attendances[i].dateOfAttendance)).format('MM-YYYY')
							let monthOnly = obj.attendances[i].dateOfAttendance.split("-");
							console.log("monthOnly", monthOnly[1] + "-" + monthOnly[2]);
							let monthAndYear = monthOnly[1] + "-" + monthOnly[2];
							if (monthAndYear == reqObj.date) {
								// Calculate Total Hours
								let convertedMins = parseInt(moment.duration(obj.attendances[i].totalHours).asMinutes())
								// console.log('Converted_Mins', convertedMins)								
								overAllWorkingMins += convertedMins
								month_overAllWorkingMins += convertedMins

								// Calculate Total Break Hours
								let convertedBreakMins = parseInt(moment.duration(obj.attendances[i].totalBreakHours).asMinutes())
								overAllBreakMins += convertedBreakMins
								month_overAllBreakMins += convertedBreakMins
							}
						}
						if (overAllWorkingMins != 0) {
							var minutes = overAllWorkingMins % 60;
							var hours = (overAllWorkingMins - minutes) / 60;
							var convertedTotalHrs = hours + ':' + (minutes < 10 ? '0' + minutes : minutes);
							console.log("convertedTotalHrs-->", convertedTotalHrs);

							var break_minutes = overAllBreakMins % 60;
							var break_hours = (overAllBreakMins - break_minutes) / 60;
							var convertedTotalBreakHrs = break_hours + ':' + (break_minutes < 10 ? '0' + break_minutes : break_minutes);
							console.log("convertedTotalBreakHrs-->", convertedTotalBreakHrs);

							obj.dataValues.totalWorkingHours = convertedTotalHrs;
							obj.dataValues.totalBreakHours = convertedTotalBreakHrs;

							obj.dataValues.totalHoursAsMinutes = overAllWorkingMins;
							obj.dataValues.totalBreakHoursAsMinutes = overAllBreakMins;
							monthData.push(obj);
						} else {
							// var break_minutes = overAllBreakMins % 60;
							// var break_hours = (overAllBreakMins - break_minutes) / 60;
							// var convertedTotalBreakHrs = break_hours + ':' + (break_minutes < 10 ? '0' + break_minutes : break_minutes);

							// obj.dataValues.totalWorkingHours = '0:0';
							// obj.dataValues.totalBreakHours = convertedTotalBreakHrs;

							// obj.dataValues.totalHoursAsMinutes = 0;
							// obj.dataValues.totalBreakHoursAsMinutes = overAllBreakMins;
							// monthData.push(obj);
						}
					});
					console.log("MONTH_DATA-->", monthData);
					// Sort High to Low
					monthData.sort((a, b) => b.dataValues.totalHoursAsMinutes - a.dataValues.totalHoursAsMinutes);

					if (month_overAllWorkingMins != 0) {
						var minutes = month_overAllWorkingMins % 60;
						var hours = (month_overAllWorkingMins - minutes) / 60;
						var convertedTotalHrs_Month = hours + ':' + (minutes < 10 ? '0' + minutes : minutes);
						console.log("convertedTotalHrs_Month-->", convertedTotalHrs_Month);

						var break_minutes = month_overAllBreakMins % 60;
						var break_hours = (month_overAllBreakMins - break_minutes) / 60;
						var convertedTotalBreakHrs_Month = break_hours + ':' + (break_minutes < 10 ? '0' + break_minutes : break_minutes);
						console.log("convertedTotalBreakHrs_Month-->", convertedTotalBreakHrs_Month);

						response.totalWorkingHoursForMonth = convertedTotalHrs_Month;
						response.totalBreakHoursForMonth = convertedTotalBreakHrs_Month;
						response.attendanceData = monthData;

						return helpers.appresponse(
							res,
							200,
							true,
							response,
							"success"
						);
					} else {
						return helpers.appresponse(
							res,
							200,
							false,
							[],
							"No data found"
						);
					}

				} else {
					return helpers.appresponse(
						res,
						404,
						false,
						[],
						"No data found"
					);
				}
			})
			.catch((err) => {
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	return {
		addnew,
		getallattenddancebyid,
		checktime,
		getAttenddanceByTodayDate,
		getoneattenddancebyidanddate,
		resqueTime,
		download,
		getAttenddanceByToday,
		attendanceSearch,
		attendanceManualEntry,
		getOverallTotalHrsForUser,
		getHoursBasedOnDate,
		getAttendanceBetweenTwoDate,
		downloadAttendanceBetweenTwoDate,
		getSingleUserAttendanceBetweenDates
		//	resqueTimeNormalFunction
	};
};

export default AttendancesController();
