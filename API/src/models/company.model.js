//import bcryptService from "../services/bcrypt.service";
module.exports = (sequelize, DataTypes) => {
	const companies = sequelize.define(
		"companies", {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			companyName: {
				type: DataTypes.STRING(255),
				unique: true
			},
			companyAddress: {
				type: DataTypes.STRING(255),
				allowNull: true,
			},
			contactNumber: {
				type: DataTypes.STRING(50),
				allowNull: true,
				unique: true

			},
			email: {
				type: DataTypes.STRING(50),
				allowNull: true,
				unique: true

			},
			noOfEmployees: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			noOfLeaves: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			fullDayTiming: {
				type: DataTypes.INTEGER,
			},
			halfDayTime: {
				type: DataTypes.INTEGER,
			},
			regularWorkIn: {
				type: DataTypes.STRING(255),
				allowNull: true,
			},
			regularWorkOut: {
				type: DataTypes.STRING(255),
				allowNull: true,
			},
			latitude: {
				type: DataTypes.STRING(255),
				allowNull: true,
			},
			longitude: {
				type: DataTypes.STRING(255),
				allowNull: true,
			},
			geofencing: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			singleLogin:{
				type: DataTypes.BOOLEAN,
				defaultValue: false,

			},
			createdAt: {
				type: DataTypes.DATE,
			},
			updateddAt: {
				type: DataTypes.DATE,
			},
		}, {
			timestamps: false
		}
	);

	// users.associate = (models) => {
	// 	users.belongsTo(models.designations, {
	// 		foreignKey: "designationId",
	// 		allowNull: false,
	// 		constraints: false,
	// 	});
	// 	users.belongsTo(models.institutionTypes, {
	// 		foreignKey: "institutionTypeId",
	// 		allowNull: false,
	// 		constraints: false,
	// 	});
	// 	users.hasMany(models.userRoleScreenActivities, {
	// 		foreignKey: "userId",
	// 		allowNull: false,
	// 		constraints: false,
	// 	});

	// };

	// users.beforeCreate((user) => {

	// 	if (user && user.password) {
	// 		user.password = bcryptService().password(user.password);
	// 	}
	// });

	// users.beforeBulkUpdate((user) => {
	// 	if (user.attributes && user.attributes.password) {
	// 		user.attributes.password = bcryptService().updatePassword(
	// 			user.attributes.password
	// 		);
	// 	}
	// });

	return companies;
};
