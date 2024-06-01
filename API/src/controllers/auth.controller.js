import _ from "lodash";
import utils from "../services/utils.service";
import db from "../../config/sequelize";
import helpers from "../helpers/helper";
const {
	users,
	companies,
	positions,
	loginLocation
} = db;
const Op = db.Sequelize.Op;

const Authcontroller = () => {
	const login = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		if (!reqObj.devicetype) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"Device Type is required"
			);
		}
		
		
		var userStatus = await users.findOne({
			where: {
				email: reqObj.email,
			},
			include: [
				 companies,
				
			]
		});

		if (userStatus == null) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"Email not Found"
			);
		}

		//console.log("user status is ::",JSON.stringify(userStatus))

		if(reqObj.latitude && reqObj.longitude && userStatus != null)
		{
			const locationObj = {}
			const authHeader = req.headers.authorization;
			// console.log("authHeader--->", authHeader);
			// let createdByUserId = await helpers.getUserId(authHeader);
			// console.log("createdByUserId-->", createdByUserId);
			// if (createdByUserId && createdByUserId !== undefined) {
				locationObj.createdAt = Date.now();
				locationObj.createdBy = userStatus.id;
			// }

			locationObj.userId = userStatus.id
			locationObj.latitude = reqObj.latitude
			locationObj.longitude = reqObj.longitude
			locationObj.ipAddress = reqObj.ipAddress
			locationObj.deviceId = reqObj.deviceId
			locationObj.isActive = reqObj.isActive
			locationObj.devicetype = reqObj.devicetype

			await loginLocation
				.update(
					{
						isActive: false,
					},
					{
						where: {
							userId: userStatus.id,
						},
					}
				)
	
			
				console.log("login locationobj",)
			await loginLocation.create(locationObj).then(async (data) => {
	
				console.log("login location created")
	
			})
		}
		
           

		//console.log("Status:::::",userStatus.company.singleLogin)
		//console.log("userStatus.deviceId ",userStatus.deviceId )
		if(reqObj.devicetype == "mobile" && userStatus.company.singleLogin == true && reqObj.deviceId != userStatus.deviceId && userStatus.deviceId != '' && userStatus.deviceId != null){
			
			console.log("UserStatus is InActive")
			return helpers.appresponse(res, 405, false, [], "Please request the device change and contact HR.");
			
		}
		else{
			if (!reqObj.email) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"email is required"
			);
		}
		if (!reqObj.password) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"password is required"
			);
		}
		var userData = await users.findOne({
			where: {
				email: reqObj.email,
			},
		});
		
		if (!userData) {
			return helpers.appresponse(res, 404, false, [], "User not found.");
		}
		console.log("userdata is : " + JSON.stringify(userData))

		if (userData.isActive != 1) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"Status is inactive. Please contact HR."
			);

		}

		var newtokengetted;
		if (userData && !userData.token) {
			newtokengetted = helpers.gettoken(userData.username, reqObj.email);
			console.log("new token is to be generated is  when empty :", newtokengetted);
			await users
				.update({
					token: newtokengetted
				}, {
					where: {
						email: reqObj.email,
					},
				})
		}
		var istokenexpiredd = await helpers.istokenexpired(userData.token)
		console.log("istokenexpiredd: " + istokenexpiredd)
		if (istokenexpiredd == true) {
			newtokengetted = helpers.gettoken(userData.username, reqObj.email);
			console.log("new token is to be generated is :", newtokengetted);
			await users
				.update({
					token: newtokengetted
				}, {
					where: {
						email: reqObj.email,
					},
				})
		}
		console.log("users password data " + userData.password);
		var auth = false;
		if (userData && userData.password) {
			auth = await helpers.correctPassword(reqObj.password, userData.password);
		} else {
			return helpers.appresponse(res, 404, false, [], "user not found");
		}
		if (auth == true) {

			await users
				.update({
					deviceId: reqObj.deviceId,
					fcmToken: reqObj.fcmToken
				}, {
					where: {
						email: reqObj.email,
					},
				})

			users.findOne({
				where: {
					email: reqObj.email
				},
				attributes: {
					exclude: ['password', "userOtp"]
				},
				include: [positions],
			}).then((userData) => {
				return helpers.appresponse(res,
					200,
					true,
					userData,
					"login successfull"
				);
			}).catch((err) => {
				return helpers.appresponse(res,
					404,
					false,
					null,
					err.message
				);
			})
		} else {
			return helpers.appresponse(res, 404, false, [], "Incorrect password.");
		}
	}
	}

	const forgetpassword = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("user create")
		if (!reqObj.email) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"email is required"
			);
		}
		var userData = await users.findOne({
			where: {
				email: reqObj.email,
			},
		});
		console.log("userdata is : " + JSON.stringify(userData))
		if (!userData) {
			return helpers.appresponse(res, 404, false, [], "user not found for the povided email address");
		}
		var otpcreated = await helpers.generateOTP()
		console.log("otpcreated : " + JSON.stringify(otpcreated))
		const maildata = {
			otp: otpcreated,
			to: reqObj.email,
			sub: "OTP Verification"
		};
		await utils.sendotp(maildata, true)
		await users
			.update({
				userOtp: otpcreated,
			}, {
				where: {
					email: reqObj.email,
				},
			}).then((_) => {

				return helpers.appresponse(res,
					200,
					true,
					[],
					"OTP sent successfully"
				);
			}).catch((err) => {
				return helpers.appresponse(res,
					404,
					false,
					null,
					err.message
				);
			})
		console.log("users password data " + userData.password);
		var auth = false;
	}
	const verifyotp = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("user create")
		if (!reqObj.email) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"email is required"
			);
		}
		if (!reqObj.otp) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"OTP is required"
			);
		}
		if (!reqObj.newpassword) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"New password is required"
			);
		}
		var userData = await users.findOne({
			where: {
				email: reqObj.email,
			},
		});
		console.log("userData : " + JSON.stringify(userData));
		if (!userData && !userData.userOtp) {
			return helpers.appresponse(res, 404, false, [], "something went wrong");
		}
		if (userData.userOtp != reqObj.otp) {
			return helpers.appresponse(res, 404, false, [], "OTP is wrong. Please check again");
		}
		const maildata = {
			otp: "password updated successfully",
			to: reqObj.email,
			sub: "Password change - success"
		};
		await utils.sendotp(maildata, false)
		await users
			.update({
				userOtp: "",
				password: reqObj.newpassword
			}, {
				where: {
					email: reqObj.email,
				},
			}).then((_) => {

				return helpers.appresponse(res,
					200,
					true,
					[],
					"password updated successfully"
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

	return {
		login,
		forgetpassword,
		verifyotp,
	};
};

export default Authcontroller();
