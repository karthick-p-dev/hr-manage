//import bcryptService from "../services/bcrypt.service";
module.exports = (sequelize, DataTypes) => {
	const loginLocation = sequelize.define(
		"loginLocation", {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
		    userId: {
				type: DataTypes.INTEGER,
			},
			latitude: {
                type: DataTypes.STRING,
				allowNull: true,
			},
			longitude: {
				type: DataTypes.STRING,
				allowNull: true,
			},
            ipAddress:{
                type: DataTypes.STRING,
				allowNull: true,
            },
            deviceId:{
            	type: DataTypes.STRING,
				allowNull: true,   
            },
            isActive:{
                type:DataTypes.BOOLEAN,
				defaultValue: true,
            },
            devicetype:{
                type: DataTypes.STRING,
				allowNull: true,  
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
    loginLocation.associate = (models) => {
		loginLocation.belongsTo(models.users, {
			foreignKey: "userId",
			allowNull: false,
			constraints: false,
		});

	};


	return loginLocation;
};
