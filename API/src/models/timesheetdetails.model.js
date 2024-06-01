//import bcryptService from "../services/bcrypt.service";
module.exports = (sequelize, DataTypes) => {
	const timesheetDetails = sequelize.define(
		"timesheetDetails", {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			timesheet_id:{
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            task_id:{
                type:DataTypes.INTEGER,
				allowNull: true,
            },
			teamId:{
				type:DataTypes.INTEGER,
				allowNull: true,
			},
            task_type_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			task_code: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			title: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
			project_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			sprint_id: {
				type: DataTypes.INTEGER,
			},
			story_points: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			estimated_hours: {
				type: DataTypes.INTEGER,
			},
			actual_hours: {
				type: DataTypes.INTEGER,
			},
			comments: {
				type: DataTypes.TEXT,
			},
			status: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			task_status_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
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

	
	timesheetDetails.associate = (models) => {
		timesheetDetails.belongsTo(models.projects, {
			foreignKey: "project_id",
			allowNull: false,
			constraints: false,
		});
	
	
		timesheetDetails.belongsTo(models.sprints, {
			foreignKey: "sprint_id",
			allowNull: false,
			constraints: false,
		});
		// timesheet.belongsTo(models.task, {
		// 	foreignKey: "task_id",
		// 	allowNull: false,
		// 	constraints: false,
		// });
		// timesheet.belongsTo(models.teams, {
		// 	foreignKey: "teamId",
		// 	allowNull: false,
		// 	constraints: false,
		// });
		
		timesheetDetails.belongsTo(models.task_type, {
			foreignKey: "task_type_id",
		
			allowNull: false,
			constraints: false,
		});
		timesheetDetails.belongsTo(models.taskStatuses, {
			foreignKey: "task_status_id",
		
			allowNull: false,
			constraints: false,
		});
		timesheetDetails.belongsTo(models.timesheet, {
			foreignKey: "timesheet_id",
		
			allowNull: false,
			constraints: false,
		});
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
	};


	return timesheetDetails;
};
