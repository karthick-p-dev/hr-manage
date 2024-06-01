import _ from "lodash";
import db from "../../config/sequelize";
import helpers from "../helpers/helper";
import NotificationService from "../services/notification.service";



const {
	holidays
} = db;
const Op = db.Sequelize.Op;

const holidayController = () => {
	const create = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		reqObj.createdAt = Date.now();
		reqObj.updateddAt = Date.now();

		if (!reqObj.date) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"Date is required."
			);
		}

		if (!reqObj.reason) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"reason is required."
			);
		}
		if (!reqObj.companyId) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"company Id is required."
			);
		}
		var holidaybydate = await holidays.findOne({
			where: {
				date: reqObj.date,
				companyId: reqObj.companyId
			},
		})
		if (holidaybydate) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"Date is already added."
			);
		}

		holidays.create(reqObj).then((holidaysData) => {

			console.log(reqObj.shownotification, "reqObj.shownotificationreqObj.shownotificationreqObj.shownotificationreqObj.shownotification")


			if (reqObj.shownotification == true) {

				NotificationService.trigerednotification(reqObj.companyId, reqObj.date + " - " + reqObj.reason + " is added to holiday.")
			}

			return helpers.appresponse(res,
				200,
				true,
				holidaysData,
				"Create successfully"
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
	const update = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		reqObj.updateddAt = Date.now();



		if (!reqObj.id) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"id is required."
			);
		}
		if (!reqObj.companyId) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"company Id is required."
			);
		}

		var holiday = await holidays.findOne({
			where: {
				id: reqObj.id,
			},
		})
		if (holiday) {
			await holidays.update(reqObj, {
				where: {
					id: reqObj.id,
				},
			})
			if (reqObj.shownotification == true) {
				NotificationService.trigerednotification(reqObj.companyId, reqObj.date + " - " + reqObj.reason + " is updated from holiday list.")
			}

			holidays.findOne({
				where: {
					id: reqObj.id,
				},
			}).then(holidaysData => {

				console.log(holidaysData)
				if (!reqObj.notification == true) {

				}
				return helpers.appresponse(res,
					200,
					true,
					holidaysData,
					"Updated successfully."
				);
			}).catch((err) => {
				return helpers.appresponse(res,
					404,
					false,
					null,
					err.message
				);
			});
		} else {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"Id not found."
			);

		}
	}

	const remeove = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		if (!reqObj.id) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"id is required."
			);
		}
		var holidaybylist = await holidays.findOne({
			where: {
				id: reqObj.id
			},
		})
		if (!holidaybylist) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"Data not found."
			);
		}


		await holidays.destroy({
			where: {
				id: reqObj.id,
			},
		}).then((holidaysData) => {

			return helpers.appresponse(res,
				200,
				true,
				[],
				"Deleted successfully."
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

	const viewall = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		if (!reqObj.companyId) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"company Id is required."
			);
		}
		await holidays.findAll({
			where: {
				companyId: reqObj.companyId
			},
		}).then((holidaysData) => {

			return helpers.appresponse(res,
				200,
				true,
				holidaysData,
				"Listed successfully ."
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
	const getone = async (req, res) => {
		const reqObj = helpers.getReqValues(req);

		reqObj.updateddAt = Date.now();



		if (!reqObj.id) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"id is required."
			);
		}
		if (!reqObj.companyId) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"company Id is required."
			);
		}

		
			holidays.findAll({
				where: {
					id: reqObj.id,
					companyId:reqObj.companyId,
				},
			}).then(holidaysData => {
				console.log(holidaysData)
				return helpers.appresponse(res,
					200,
					true,
					holidaysData,
					"success."
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
		
	
	return {
		create,
		update,
		remeove,
		viewall,
		getone,

	};
};

export default holidayController();
