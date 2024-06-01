//import bcryptService from "../services/bcrypt.service";
module.exports = (sequelize, DataTypes) => {
	const projects = sequelize.define(
		"projects",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			companyId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			teamleaderId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			managerId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING(255),
				allowNull: true,
			},
			code: {
				type: DataTypes.STRING(255),
				allowNull: true,
			},
			start_date: {
				type: DataTypes.DATE,
			},
			end_date: {
				type: DataTypes.DATE,
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

	projects.associate = (models) => {
		projects.belongsTo(models.users, {
			as: "teamleader",
			foreignKey: "teamleaderId",
			allowNull: false,
			constraints: false,
		});
		projects.belongsTo(models.users, {
			as: "manager",
			foreignKey: "managerId",
			allowNull: false,
			constraints: false,
		});
	};

	return projects;
};
