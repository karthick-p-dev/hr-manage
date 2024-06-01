import _ from "lodash";
import helpers from "../helpers/helper"
import db from "../../config/sequelize";

const {
	companies
} = db;
const Op = db.Sequelize.Op;

const CompanyController = () => {
	const create = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		if (!reqObj.companyName) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"Company Name is required"
			);
		}
		if (!reqObj.companyAddress) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"Company Address is required"
			);
		}
		if (!reqObj.contactNumber) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"Contact Number is required"
			);
		}
		if (!reqObj.email) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"email is required"
			)
		}
		if (!reqObj.noOfLeaves) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"Number of leaves is required"
			)
		}
		if (!reqObj.fullDayTiming) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"Full Day Timing is required"
			);
		}

		if (!reqObj.halfDayTime) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"Half Day Time  is required"
			);
		}
		if (!reqObj.regularWorkIn) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"Regular Work In time is required"
			);
		}
		if (!reqObj.regularWorkOut) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"Regular Work Out time is required"
			);
		}
		if (!reqObj.noOfEmployees) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"No of Employees is required"
			);
		}

		reqObj.createdAt = Date.now();
		reqObj.updateddAt = Date.now();
		var companydata = companies.findOne({
			where: {
				companyName: reqObj.companyName
			},
		});

		if (companydata && companydata.companyName) {
			return helpers.appresponse(res,
				404,
				false,
				[],
				"Company " + reqObj.companyName + " is already in exist"
			);
		}
		companies.create(reqObj).then((companiesData) => {
			return helpers.appresponse(res,
				200,
				true,
				companiesData,
				"company added successfully"
			);

		}).catch((err) => {
			return helpers.appresponse(res,
				404,
				false,
				null,
				err.message
			);

		});
	};

	const getall = async (req, res) => {
		companies.findAll().then((allcompaniesData) => {
			return helpers.appresponse(res,
				200,
				true,
				allcompaniesData,
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
	};

	const getcompanybymail = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		console.log("request name is : " + reqObj.email);
		companies.findOne({
			where: {
				email: reqObj.email
			},
		}).then((companyData) => {
			if (companyData) {
				return helpers.appresponse(res,
					200,
					true,
					companyData,
					"success",
				);
			} else {
				return helpers.appresponse(res,
					404,
					false,
					[],
					"no company found for the company name " + reqObj.email,
				);
			}
		}).catch((err) => {
			return helpers.appresponse(res,
				404,
				false,
				null,
				err.message
			);
		})
	}
	const update = async (req, res) => {
		const reqObj = helpers.getReqValues(req);
		if (!reqObj.id) {
			return helpers.appresponse(res,
				404,
				false,
				null,
				"Company Id is required."
			);
		}
		reqObj.updateddAt = Date.now();
		var companydata = companies.findOne({
			where: {
				id: reqObj.id
			},
		});

		if (companydata) {
			await companies.update(reqObj, {
				where: {
					id: reqObj.id,
				},
			})
			companies.findOne({
				where: {
					id: reqObj.id
				},
			}).
			then((companiesData) => {
				return helpers.appresponse(res,
					200,
					true,
					companiesData,
					"company updated successfully"
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
				[],
				"Company not found."
			);
		}

	};
	return {
		create,
		getall,
		getcompanybymail,
		update
	};
};

export default CompanyController();
