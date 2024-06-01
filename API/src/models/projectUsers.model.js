//import bcryptService from "../services/bcrypt.service";
module.exports = (sequelize, DataTypes) => {
	const projectUsers = sequelize.define(
		"projectUsers",
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
			projectId: {
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

	projectUsers.associate = (models) => {
		projectUsers.belongsTo(models.users, {
			foreignKey: "userId",
			allowNull: false,
			constraints: false,
		});
		// projectUsers.belongsTo(models.positions, {
		// 	foreignKey: "position_id",
		// 	allowNull: false,
		// 	constraints: false,
		// });
		projectUsers.belongsTo(models.projects, {
			foreignKey: "projectId",
			allowNull: false,
			constraints: false,
		});
	
	};

	return projectUsers;
};
