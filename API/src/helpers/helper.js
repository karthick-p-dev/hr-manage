import config from "../../config/config";
import bcrypt from "bcrypt";
import _ from "lodash";
import jwt from "jsonwebtoken";
import db from "../../config/sequelize";

const { users } = db;

const helper = () => {
	const gettoken = (username, email) => {
		const accestoken = jwt.sign(
			{
				username,
				email,
			},
			config.jwtSecret,
			{
				algorithm: "HS256",
				expiresIn: "90d",
			}
		);
		return accestoken;
	};
	const authenticateJWT = (req, res, next) => {
		const authHeader = req.headers.authorization;
		if (authHeader) {
			console.log("authHeader is to be : " + authHeader);
		} else {
			return appresponse(res, 404, false, [], "token is required");
		}
		res.header("Access-Control-Allow-Origin", "*");
		res.header(
			"Access-Control-Allow-Methods",
			"GET",
			"POST",
			"DELETE",
			"UPDATE",
			"PUT",
			"PATCH"
		);
		res.header(
			"Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content-Type, Accept"
		);
		if (authHeader) {
			const Token = authHeader.split("Bearer ")[1];
			console.log(" is to be : " + Token);
			users
				.findOne({
					where: {
						token: Token,
					},
				})
				.then((items) => {
					if (!items) {
						console.log("auth item is to be NULL");
						return appresponse(
							res,
							401,
							false,
							[],
							"the provided token was mismatch"
						);
					} else {
						console.log(
							"auth item is to be " + JSON.stringify(items)
						);
						var istokenexpiredd = istokenexpired(Token);
						console.log("istokenexpiredd", istokenexpiredd);
						if (istokenexpiredd == true) {
							console.log("istokenexpiredd", istokenexpiredd);
							return appresponse(
								res,
								401,
								false,
								[],
								"token expired"
							);
						}
						jwt.verify(Token, config.jwtSecret, (err, user) => {
							if (err) {
								return appresponse(
									res,
									404,
									false,
									null,
									err.message
								);
							}
							console.log("token verification is  success");
							next();
						});
					}
				})
				.catch((err) => {
					console.log("token error is " + err.message);
					return appresponse(res, 404, false, [], err.message);
				});
		} else {
			return appresponse(res, 404, false, null, "token missing");
		}
	};
	const getReqValues = (req) => {
		return _.extend(req.body, req.params, req.query);
	};

	const istokenexpired = (token) => {
		var tokenexpired = false;
		jwt.verify(token, config.jwtSecret, (err, user) => {
			if (err) {
				console.log("jwt expired error :" + err.message);
				tokenexpired = true;
			} else {
				tokenexpired = false;
			}
		});
		return tokenexpired;
	};
	const appresponse = (res, statuscode, status, data, message) => {
		return res.status(statuscode).json({
			status: status,
			statuscode: statuscode,
			data: data,
			message: message,
		});
	};

	const encryptpassword = (password) => {
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(password, salt);
		return hash;
	};

	const correctPassword = (enteredPassword, originalPassword) => {
		const res = bcrypt.compare(enteredPassword, originalPassword);
		return res;
	};
	const generateOTP = () => {
		const min = 100000;
		const max = 999999;
		const otpis = Math.floor(Math.random() * (max - min + 1)) + min;
		console.log("otp is : " + otpis);
		return otpis;
	};

	const getUserId = async (authHeader) => {
		if (authHeader) {
			const Token = authHeader.split("Bearer ")[1];
			const user = await users.findOne({
				where: {
					token: Token,
				},
			});

			return user.id;
		}
	};

	return {
		gettoken,
		authenticateJWT,
		getReqValues,
		istokenexpired,
		appresponse,
		encryptpassword,
		generateOTP,
		correctPassword,
		getUserId,
	};
};
export default helper();
