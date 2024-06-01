//import bcryptService from "../services/bcrypt.service";
module.exports = (sequelize, DataTypes) => {
	const teams = sequelize.define(
		"teams", {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
            companyId:{
                type: DataTypes.INTEGER,
                allowNull: true,
            },
			teamLeaderId:{
                type: DataTypes.INTEGER,
                allowNull: true,
            },
			teamManagerId:{
                type: DataTypes.INTEGER,
                allowNull: true,
            },
			name:{
                type:DataTypes.STRING(255),
				allowNull: true,
            },
            code:{
                type:DataTypes.STRING(255),
				allowNull: true,
                
            },
            status:{
                type: DataTypes.BOOLEAN,
				defaultValue: false,
            },
            createdAt: {
				type: DataTypes.DATE,
                
			},
			updatedAt: {
				type: DataTypes.DATE,
			},
            createdBy: {
				type: DataTypes.INTEGER,
             
			},
			updatedBy: {
				type: DataTypes.INTEGER,
               
			},
		}, {
			timestamps: false
		}
	);

	
	teams.associate = (models) => {
		teams.belongsTo(models.users, {
			as: "teamleader",
			foreignKey: "teamLeaderId",
			allowNull: false,
			constraints: false,
		});
		teams.belongsTo(models.users, {
			as: "manager",
			foreignKey: "teamManagerId",
			allowNull: false,
			constraints: false,
		});
		
	};
	

	return teams;
};
