module.exports = (sequelize, DataTypes) => {
	const information = sequelize.define(
		"information", {
			id: {
				type: DataTypes.INTEGER,
                allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			companyId: {
				type: DataTypes.INTEGER,
				
			},
			imageName: {
				type: DataTypes.STRING(),
				allowNull: true,
				//defaultValue: null
				
			},
            imageType:{
                type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: true,
            },
            textContent:{
                type: DataTypes.STRING(),
				allowNull: true,
				
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



	return information;
};
