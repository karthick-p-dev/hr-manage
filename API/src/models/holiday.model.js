module.exports = (sequelize, DataTypes) => {
	const holidays = sequelize.define(
		"holidays", {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			date: {
				type: DataTypes.STRING(),
			},
			shownotification: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			reason: {
				type: DataTypes.STRING(),
			},
			day: {
				type: DataTypes.STRING(),
			},
			companyId: {
				type: DataTypes.INTEGER,
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

	// attendances.associate = (models) => {
	// 	attendances.belongsTo(models.users, {
	// 		foreignKey: "userId",
	// 		allowNull: false,
	// 		constraints: false,
	// 	});
	// 	// users.belongsTo(models.institutionTypes, {
	// 	// 	foreignKey: "institutionTypeId",
	// 	// 	allowNull: false,
	// 	// 	constraints: false,
	// 	// });
	// 	// users.hasMany(models.userRoleScreenActivities, {
	// 	// 	foreignKey: "userId",
	// 	// 	allowNull: false,
	// 	// 	constraints: false,
	// 	// });

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

	return holidays;
};
