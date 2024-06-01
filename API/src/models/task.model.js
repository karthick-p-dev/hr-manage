//import bcryptService from "../services/bcrypt.service";
module.exports = (sequelize, DataTypes) => {
	const task = sequelize.define(
		"task",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			task_type_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			companyId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			task_code: {
				type: DataTypes.STRING(255),
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
		},
		{
			timestamps: false,
		}
	);

	task.associate = (models) => {
		task.belongsTo(models.task_type, {
			foreignKey: "task_type_id",
			allowNull: false,
			constraints: false,
		});
		task.belongsTo(models.taskStatuses, {
			foreignKey: "task_status_id",
			allowNull: false,
			constraints: false,
		});
		task.belongsTo(models.projects, {
			foreignKey: "project_id",
			allowNull: false,
			constraints: false,
		});
		task.belongsTo(models.sprints, {
			foreignKey: "sprint_id",
			// allowNull: false,
			constraints: false,
		});
	};

	return task;
};
