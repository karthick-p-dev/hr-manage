import FCM from "fcm-push";
import config from "../../config/config";
import db from "../../config/sequelize";
const {
	users
} = db;

const notificationService = () => {
	var serverKey = 'AAAAHW1qxpo:APA91bGa9iAfH63tor-m5mJmWjTAvA2cWakIUP7CUDma6-_Ipv01Fs1PQuTs6yS6NwZQGw9tGRNrNq1SPJLpSN0RD4L9eIQDEYGJ9ItbmN2-_nZd4ripH51GWaCldRN-ddVLZYpPKdVl';
	var fcm = new FCM(serverKey);

	const singlepushnotification = async (id, value) => {


		var userToken = await users.findOne({
			where: {
				email: id
			},
			// include: [users]
		})

		var message = {
			to: userToken.fcmToken, // required fill with device token or topics
			collapse_key: 'your_collapse_key',
			data: {
				your_custom_data_key: ''
			},
			notification: {
				title: 'HRmanage',
				body: value
			}
		};

		// //callback style
		// fcm.send(message, function (err, response) {
		// 	if (err) {
		// 		console.log("Something has gone wrong!");
		// 	} else {
		// 		console.log("Successfully sent with response: ", response);
		// 	}
		// });

		//promise style
		fcm.send(message)
			.then(function (response) {
				console.log("Successfully sent with response: ", response);
			})
			.catch(function (err) {
				console.log("Something has gone wrong!");
				console.error(err);
			})

	};
	const notificationtoall = async (value) => {
		var userToken = await users.findAll({
			where: {
				isActive: true
			},
			// include: [users]
		})

		userToken.forEach(token => {
			var message = {
				to: token.fcmToken, // required fill with device token or topics
				collapse_key: 'your_collapse_key',
				data: {

					your_custom_data_key: ''
				},
				notification: {
					title: 'HRmanage',
					body: value
				}
			};

			//promise style
			fcm.send(message)
				.then(function (response) {
					console.log("Successfully sent with response: ", response);
				})
				.catch(function (err) {
					console.log("Something has gone wrong!");
					console.error(err);
				})

		});



	};
	const trigerednotification = async (id, value) => {

		var userToken = await users.findAll({
			where: {
				companyId: id,
				isActive : true
			},
			// include: [users]
		})

		userToken.forEach(token => {
			var message = {
				to: token.fcmToken, // required fill with device token or topics
				collapse_key: 'your_collapse_key',
				data: {

					your_custom_data_key: ''
				},
				notification: {
					title: 'HRmanage',
					body: value
				}
			};

			//promise style
			fcm.send(message)
				.then(function (response) {
					console.log("Successfully sent with response: ", response);
				})
				.catch(function (err) {
					console.log("Something has gone wrong!");
					console.error(err.toString());
				})

		});



	};
	const trigerednotificationtoadmins = async (id, value) => {

		var userToken = await users.findAll({
			where: {
				companyId: id,
				roleId: 2,
				isActive : true,
			},
		})

		userToken.forEach(token => {
			var message = {
				to: token.fcmToken,
				collapse_key: 'your_collapse_key',
				data: {

					your_custom_data_key: ''
				},
				notification: {
					title: 'HRmanage',
					body: value
				}
			};

			//promise style
			fcm.send(message)
				.then(function (response) {
					console.log("Successfully sent with response: ", response);
				})
				.catch(function (err) {
					console.log("Something has gone wrong!");
					console.error(err.toString());
				})

		});



	};

	const trigerednotificationtoUsers = async (id, userId,value) => {

		var userToken = await users.findAll({
			where: {
				companyId: id,
				id: userId
			},
		})

		userToken.forEach(token => {
			var message = {
				to: token.fcmToken,
				collapse_key: 'your_collapse_key',
				data: {

					your_custom_data_key: ''
				},
				notification: {
					title: 'HRmanage',
					body: value
				}
			};

			//promise style
			fcm.send(message)
				.then(function (response) {
					console.log("Successfully sent with response: ", response);
				})
				.catch(function (err) {
					console.log("Something has gone wrong!");
					console.error(err.toString());
				})

		});



	};
	return {
		singlepushnotification,
		notificationtoall,
		trigerednotification,
		trigerednotificationtoadmins,
		trigerednotificationtoUsers
	};
};
export default notificationService();
