//import bcryptService from "../services/bcrypt.service";
module.exports = (sequelize, DataTypes) => {
	const attendances = sequelize.define(
		"attendances", {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			userId: {
				type: DataTypes.INTEGER,
			},
			dateOfAttendance: {
				type: DataTypes.STRING(50),
				allowNull: true,
			},
			attendanceDate:{
                type: DataTypes.DATE,
            },
			inTime: {
				type: DataTypes.STRING(),
				allowNull: true,
			},
			status: {
				type: DataTypes.STRING(),
				allowNull: true,
			},
			outTime: {
				type: DataTypes.STRING(),
				allowNull: true,
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
			firstOut: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
			rescueadded: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			totalHours: {
				type: DataTypes.STRING(20),
				allowNull: true,
			},
			totalBreakHours: {
				type: DataTypes.STRING(20),
				defaultValue: '00:00',
				allowNull: true,
			},
			attendanceStatus: {
				type: DataTypes.STRING(50),
				defaultValue: "Absent",

			},
			manualImage: {
				type: DataTypes.STRING(50),
				defaultValue: "",

			},
			attendanceType: {
				type: DataTypes.STRING(50),
				defaultValue: "",
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

	attendances.associate = (models) => {
		attendances.belongsTo(models.users, {
			foreignKey: "userId",
			allowNull: false,
			constraints: false,
		});
		// users.belongsTo(models.institutionTypes, {
		// 	foreignKey: "institutionTypeId",
		// 	allowNull: false,
		// 	constraints: false,
		// });
		// users.hasMany(models.userRoleScreenActivities, {
		// 	foreignKey: "userId",
		// 	allowNull: false,
		// 	constraints: false,
		// });

	};

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

	return attendances;
};
