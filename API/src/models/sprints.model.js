//import bcryptService from "../services/bcrypt.service";
module.exports = (sequelize, DataTypes) => {
	const sprints = sequelize.define(
		"sprints",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			project_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			companyId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			sprint_name: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
			code: {
				type:DataTypes.STRING(255),
				allowNull: false,
			},
			start_dates: {
				type: DataTypes.DATE,
			},
			end_date: {
				type: DataTypes.DATE,
			},
			spill_over_count: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
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

	sprints.associate = (models) => {
		sprints.belongsTo(models.projects, {
			foreignKey: "project_id",
			allowNull: false,
			constraints: false,
		});
	};

	return sprints;
};
