//import bcryptService from "../services/bcrypt.service";
module.exports = (sequelize, DataTypes) => {
	const teamusers = sequelize.define(
		"teamusers",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			companyId: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			teamId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			// position_id: {
			// 	type: DataTypes.INTEGER,
			// 	allowNull: false,
			// },
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
			status: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			createdAt: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			updatedAt: {
				type: DataTypes.DATE,
			},
			createdBy: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			updatedBy: {
				type: DataTypes.INTEGER,
			},
		},
		{
			timestamps: false,
		}
	);

	teamusers.associate = (models) => {
		teamusers.belongsTo(models.users, {
			foreignKey: "userId",
			allowNull: false,
			constraints: false,
		});
		// teamusers.belongsTo(models.positions, {
		// 	foreignKey: "position_id",
		// 	allowNull: false,
		// 	constraints: false,
		// });
		teamusers.belongsTo(models.teams, {
			foreignKey: "teamId",
			allowNull: false,
			constraints: false,
		});
	
		// teamusers.belongsTo(models.users, {as: 'teamLeader', foreignKey: 'teamLeaderId'});
		// teamusers.belongsTo(models.users, {as: 'manager', foreignKey: 'teamManagerId'});
	};

	return teamusers;
};
