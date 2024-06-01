import _ from "lodash";
import db from "../../config/sequelize";
import helpers from "../helpers/helper";
import utils from "../services/utils.service";
import NotificationService from "../services/notification.service";

const { device, users } = db;
const Op = db.Sequelize.Op;

const deviceController = () => {
	const deviceCreate = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		var userStatus = await users.findOne({
			where: {
				email: reqObj.email,
			},
		});
		console.log("CompanyId:::::::::::::", userStatus);
		console.log("Email upd");
		if (!userStatus) {
			return helpers.appresponse(
				res,
				404,
				false,
				[],
				"user not found for the povided email address"
			);
		}
		console.log("CompanyId:::::::::::::", userStatus.companyId);
		console.log("requestObject", reqObj);

		reqObj.createdAt = Date.now();
		reqObj.updatedAt = Date.now();
		reqObj.companyId = userStatus.companyId;
		reqObj.deviceStatus = "Not Yet Approved";
		reqObj.userId = userStatus.id;
		reqObj.employeeId = userStatus.employeeId;
		reqObj.userName = userStatus.userName;

		device
			.create(reqObj)

			.then((infoData) => {
				return helpers.appresponse(
					res,
					200,
					true,
					infoData,
					" added successfully"
				);
			})

			.catch((err) => {
				console.log("Email");
				return helpers.appresponse(res, 404, false, null, err.message);
			});
	};

	const getdevice = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		await device
			.findAll({
				where: {
					companyId: reqObj.companyId,
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
	const approveDevice = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		if (!reqObj.id) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Device Request id is required"
			);
		}
		if (!reqObj.deviceStatus) {
			return helpers.appresponse(
				res,
				404,
				false,
				null,
				"Device Status id is required"
			);
		}
		reqObj.updateddAt = Date.now();
		await device.update(reqObj, {
			where: {
				id: reqObj.id,
			},
		});
		var deviceStatusData = await device.findOne({
			where: {
				id: reqObj.id,
			},
		});
		if (!deviceStatusData) {
			return helpers.appresponse(res, 404, false, [], "No device Found");
		}
		console.log("deviceStatusData", deviceStatusData.deviceId);

		var name = deviceStatusData.userName;
		var email = deviceStatusData.email;
		var status = deviceStatusData.deviceStatus;

		const maildata = {
			name: name,
			email: email,
			to: email,
			status: status,
			sub: status,
		};
		console.log("MailData", maildata);
		utils.sendDeviceRequest(maildata, email);
		if (deviceStatusData.deviceStatus == "approved") {
			await users
				.update(
					{
						deviceId: "",
						token: "",
					},
					{
						where: {
							id: deviceStatusData.userId,
						},
					}
				)
				.then((data) => {
					return helpers.appresponse(
						res,
						200,
						true,
						data,
						"Device Id updated"
					);
				});
			console.log("Device updated");
		} else {
			console.log("device rejected");
			return helpers.appresponse(res, 200, true, [], "Device Rejected");
		}
	};

	return {
		deviceCreate,
		getdevice,
		approveDevice,
	};
};

export default deviceController();
