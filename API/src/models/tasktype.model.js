//import bcryptService from "../services/bcrypt.service";
module.exports = (sequelize, DataTypes) => {
	const task_type = sequelize.define(
		"task_type", {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
            companyId:{
                type: DataTypes.INTEGER,
                allowNull: false,
            },
			name:{
                type:DataTypes.STRING(255),
				allowNull: false,
            },
            code:{
                type:DataTypes.INTEGER,
				allowNull: false,
                
            },
			status:{
                type:DataTypes.BOOLEAN,
				defaultValue: false,
				
            },
            isActive:{
                type:DataTypes.BOOLEAN,
				defaultValue: true,
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
		}, {
			timestamps: false
		}
	);

	

	

	return task_type;
};
