//import bcryptService from "../services/bcrypt.service";
module.exports = (sequelize, DataTypes) => {
	const requestedLeaves = sequelize.define(
		"requestedLeaves", {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			userToId: {
				type: DataTypes.INTEGER,
            },
            userId :{
                type: DataTypes.INTEGER,
            },
            leaveId : {
                type: DataTypes.INTEGER,
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

	requestedLeaves.associate = (models) => {
	

		 requestedLeaves.belongsTo(models.users, {as: 'user', foreignKey: 'userId'});
	
        requestedLeaves.belongsTo(models.leaves, {
			foreignKey: "leaveId",
			allowNull: false,
			constraints: false,
		});
		// requestedLeaves.belongsTo(models.users, {
		// 	foreignKey: "userId",
		// 	allowNull: false,
		// 	constraints: false,
		// });
		
        


	};
	return requestedLeaves;
};
