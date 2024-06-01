//import bcryptService from "../services/bcrypt.service";
module.exports = (sequelize, DataTypes) => {
	const leaves = sequelize.define(
		"leaves", {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			userId: {
				type: DataTypes.INTEGER,
			},
			companyId: {
				type: DataTypes.INTEGER,
			},
			userType: {
				type: DataTypes.STRING(25),
			},
			status: {
				type: DataTypes.STRING(25),
			},
			request: {
				type: DataTypes.STRING(50),
			},
			reason: {
				type: DataTypes.STRING(100),
			},
			fromDateFormat:{
                type: DataTypes.DATE,
            },
			fromDate: {
				type: DataTypes.STRING(15),
			},
			toDate: {
				type: DataTypes.STRING(15),
			},
			fromTime:{
					type: DataTypes.TIME,
			},
			toTime:{
				type: DataTypes.TIME,
			},
			toDateFormat:{
                type: DataTypes.DATE,
            },
			permission: {
				type: DataTypes.STRING(15),
			},
			notes: {
				type: DataTypes.STRING(255),
			},
			feedBack: {
				type: DataTypes.STRING(255),
			},
			noOfDaysLeaveApply: {
				type: DataTypes.INTEGER,
			},
			approvedBy:{
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

	leaves.associate = (models) => {
		// leaves.belongsTo(models.users, {
		// 	foreignKey: "userId",
		// 	allowNull: false,
		// 	constraints: false,
		// });
		leaves.belongsTo(models.users, {as: 'user', foreignKey: 'userId'});
		leaves.belongsTo(models.users, {as: 'approver', foreignKey: 'approvedBy'});

	};
	return leaves;
};
