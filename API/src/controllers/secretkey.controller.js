import _ from "lodash";
import db from "../../config/sequelize";
import helpers from "../helpers/helper";
import utils from "../services/utils.service";


const {
	seckeys
} = db;
const Op = db.Sequelize.Op;

const seckeyssController = () => {
	const getseckey = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		reqObj.createdAt = Date.now();
		reqObj.updateddAt = Date.now();
		var data = await utils.generateOTP();
		console.log("data is fghj" + data);
		reqObj.secretKey = "" + data;


		seckeys
			.findAndCountAll()
			.then(async result => {
				console.log(result.count);
				if (result.count == 0) {
					seckeys.create(reqObj).then((seckeysData) => {
						return helpers.appresponse(res,
							200,
							true,
							seckeysData,
							"success"
						);
					}).catch((err) => {
						return helpers.appresponse(res,
							404,
							false,
							null,
							err.message
						);
					});
				}

				await seckeys.update({
					secretKey: reqObj.secretKey
				}, {
					where: {
						id: 1,
					},
				})

				seckeys.findOne({
					where: {
						id: 1,
					},
				}).then((seckeysData) => {
					return helpers.appresponse(res,
						200,
						true,
						seckeysData,
						"success"
					);
				}).catch((err) => {
					return helpers.appresponse(res,
						404,
						false,
						null,
						err.message
					);
				});
			});
	}

	return {
		getseckey
	};
};

export default seckeyssController();
