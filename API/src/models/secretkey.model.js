//import bcryptService from "../services/bcrypt.service";
module.exports = (sequelize, DataTypes) => {
	const seckeys = sequelize.define(
		"seckeys", {
			id: {
				type: DataTypes.BIGINT,
				primaryKey: true,
				autoIncrement: true,
			},
			secretKey: {
				type: DataTypes.STRING(50),
				allowNull: false,
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



	return seckeys;
};
