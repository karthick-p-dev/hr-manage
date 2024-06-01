//import bcryptService from "../services/bcrypt.service";
module.exports = (sequelize, DataTypes) => {
	const timesheet = sequelize.define(
		"timesheet", {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			timesheet_date:{
                type: DataTypes.DATE,
            },
            companyId:{
                type: DataTypes.INTEGER,
                allowNull: true,
            },
			userId:{
                type:DataTypes.INTEGER,
				allowNull: true,
            },
			teamId:{
				type:DataTypes.INTEGER,
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
		}, {
			timestamps: false
		}
	);

	
	// timesheet.associate = (models) => {
	// 	timesheet.belongsTo(models.projects, {
	// 		foreignKey: "project_id",
	// 		allowNull: false,
	// 		constraints: false,
	// 	});
	
	
	// 	timesheet.belongsTo(models.sprints, {
	// 		foreignKey: "sprint_id",
	// 		allowNull: false,
	// 		constraints: false,
	// 	});
	// 	timesheet.belongsTo(models.task, {
	// 		foreignKey: "task_id",
	// 		allowNull: false,
	// 		constraints: false,
	// 	});
	// 	timesheet.belongsTo(models.teams, {
	// 		foreignKey: "teamId",
	// 		allowNull: false,
	// 		constraints: false,
	// 	});
		
	// 	timesheet.belongsTo(models.task_type, {
	// 		foreignKey: "task_type_id",
		
	// 		allowNull: false,
	// 		constraints: false,
	// 	});
	// 	timesheet.belongsTo(models.taskStatuses, {
	// 		foreignKey: "task_status_id",
		
	// 		allowNull: false,
	// 		constraints: false,
	// 	});
	// };
	// timesheet.associate = (models) => {
	// 	timesheet.belongsTo(models.teams, {
	// 		foreignKey: "teamId",
	// 		allowNull: false,
	// 		constraints: false,
	// 	});
	// };
	// timesheet.associate = (models) => {
	// 	timesheet.belongsTo(models.task, {
	// 		foreignKey: "task_id",
	// 		allowNull: false,
	// 		constraints: false,
	// 	});
	// };


	return timesheet;
};
