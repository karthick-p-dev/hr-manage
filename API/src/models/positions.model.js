//import bcryptService from "../services/bcrypt.service";
module.exports = (sequelize, DataTypes) => {
	const positions = sequelize.define(
		"positions",
		{
			id: {
				type: DataTypes.BIGINT,
				primaryKey: true,
				autoIncrement: true,
			},
			parentId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			companyId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING(50),
				allowNull: false,
				unique: true,
			},
			topPosition: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			status: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			permissionJson:{
				type: DataTypes.TEXT,
				defaultValue: false,
			},
			createdAt: {
				type: DataTypes.DATE,
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

	positions.associate = (models) => {
		positions.belongsTo(models.positions, {
			foreignKey: "parentId",
			allowNull: false,
			constraints: false,
		});
	};

	return positions;
};
