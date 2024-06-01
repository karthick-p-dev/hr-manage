//import bcryptService from "../services/bcrypt.service";
module.exports = (sequelize, DataTypes) => {
	const taskStatuses = sequelize.define(
		"taskStatuses",
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
			name: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
			status: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			createdAt: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			createdBy: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			updatedAt: {
				type: DataTypes.DATE,
			},
			updatedBy: {
				type: DataTypes.INTEGER,
			},
		},
		{
			timestamps: false,
		}
	);

	return taskStatuses;
};
