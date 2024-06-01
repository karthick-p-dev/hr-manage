//import bcryptService from "../services/bcrypt.service";
module.exports = (sequelize, DataTypes) => {
	const findedfaces = sequelize.define(
		"findedfaces", {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			userId: {
				type: DataTypes.INTEGER,
			},
			userName: {
				type: DataTypes.STRING(),
			},
		}
	);


	return findedfaces;
};
