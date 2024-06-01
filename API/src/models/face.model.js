//import bcryptService from "../services/bcrypt.service";
module.exports = (sequelize, DataTypes) => {
	const faces = sequelize.define(
		"faces", {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
		    userId: {
				type: DataTypes.INTEGER,
			},
			faceData: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			userKey: {
				type: DataTypes.DECIMAL(10, 2),
			},
         }
	);


	return faces;
};
