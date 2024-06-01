//import bcryptService from "../services/bcrypt.service";
module.exports = (sequelize, DataTypes) => {
	const emailSents = sequelize.define(
		"emailSents", {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			userId:{
                type: DataTypes.INTEGER,
				allowNull: true,
            },
            email:{
                type: DataTypes.STRING(255),
				allowNull: true,
            },
            isSent:{
                type: DataTypes.BOOLEAN,
				defaultValue: false,
            },
            subject:{
                type: DataTypes.STRING(255),
				allowNull: true, 
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

	return emailSents;
};
