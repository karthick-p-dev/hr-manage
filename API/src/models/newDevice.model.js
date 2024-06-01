module.exports = (sequelize, DataTypes) => {
	const device = sequelize.define("device", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		companyId: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		userId: {
			type: DataTypes.INTEGER,
		},

		email: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		userName: {
			type: DataTypes.STRING(50),
		},
		employeeId: {
			type: DataTypes.INTEGER,
		},

		deviceStatus: {
			type: DataTypes.STRING,
		},

		createdAt: {
			type: DataTypes.DATE,
		},
		updatedAt: {
			type: DataTypes.DATE,
		},
	});

	device.associate = (models) => {
		device.belongsTo(models.users, {
			foreignKey: "userId",
			allowNull: false,
			constraints: false,
		});
	};

	return device;
};
