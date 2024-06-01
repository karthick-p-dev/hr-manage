import bcryptService from "../services/bcrypt.service";
module.exports = (sequelize, DataTypes) => {
	const users = sequelize.define(
		"users",
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			positionId: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			firstName: {
				type: DataTypes.STRING(50),
				allowNull: true,
			},
			lastName: {
				type: DataTypes.STRING(50),
				allowNull: true,
			},
			userName: {
				type: DataTypes.STRING(50),
				allowNull: true,
			},
			designation: {
				type: DataTypes.STRING(50),
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING(50),
				allowNull: false,
				unique: true,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			token: {
				type: DataTypes.STRING,
			},
			deviceId: {
				type: DataTypes.STRING,
			},
			fcmToken: {
				type: DataTypes.STRING,
			},
			mobileNumber: {
				type: DataTypes.STRING(20),
				allowNull: true,
			},
			resqueToken: {
				type: DataTypes.STRING,
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
			DOB: {
				type: DataTypes.STRING(20),
				allowNull: true,
			},
			dateOfJoining:{
                type: DataTypes.DATE,
            },
			dateOfExit:{
				type: DataTypes.DATE,
			},
			gender: {
				type: DataTypes.STRING(20),
				allowNull: true,
			},
			roleId: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			companyId: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			employeeId: {
				type: DataTypes.INTEGER,
			},
			profile: {
				type: DataTypes.STRING(50),
				allowNull: true,
			},
			userOtp: {
				type: DataTypes.STRING(50),
				allowNull: true,
			},
			numberOfLeaves: {
				type: DataTypes.DECIMAL(10, 2),
			},
			onshore :{
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			createdAt: {
				type: DataTypes.DATE,
			},
			updateddAt: {
				type: DataTypes.DATE,
			},
		},
		{
			timestamps: false,
		}
	);

	// users.sync().then(() => {
	// 	var token = helpers.gettoken("SuperAdmin", "hrm@greatinnovus.com")
	// 	console.log("token is " + token);
	// 	var encryptpassword = helpers.encryptpassword("super@12345")

	// 	users.findOne({
	// 		where: {
	// 			id: 1
	// 		}
	// 	}).then(value => {
	// 		console.log("value is " + value)
	// 		if (value && value.id) {

	// 		} else {
	// 			users.create({
	// 				firstName: 'Super',
	// 				lastName: 'Admin',
	// 				userName: 'SuperAdmin',
	// 				email: 'hrm@greatinnovus.com',
	// 				password: encryptpassword,
	// 				token: token,
	// 				employeeId: 0,
	// 				DOB: "01.02.2022",
	// 				gender: "Male",
	// 				roleId: 1,
	// 				employeeId: 0,
	// 				companyId: 1,
	// 				designation: 'superadmin',
	// 				createdAt : Date.now(),
	// 				updateddAt : Date.now(),
	// 			});
	// 		}
	// 	}).catch(err => {
	// 		console.log("error in initial insert  in model is : " + err.message)
	// 	});
	// });

	// });

	users.associate = (models) => {
		users.belongsTo(models.companies, {
			foreignKey: "companyId",
			allowNull: false,
			constraints: false,
		});
		users.belongsTo(models.positions, {
			foreignKey: "positionId",
			allowNull: false,
			constraints: false,
		});
		users.hasMany(models.attendances, {
			foreignKey: "userId",
			allowNull: false,
			constraints: false,
		});
		users.hasOne(models.roles, {
			sourceKey: "roleId",
			foreignKey: "id",
			allowNull: false,
			constraints: false,
		});
	};

	users.beforeCreate((user) => {
		if (user && user.password) {
			user.password = bcryptService().password(user.password);
		}
	});

	users.beforeUpdate((user) => {
		if (user && user.password) {
			user.password = bcryptService().password(user.password);
		}
	});

	users.beforeBulkUpdate((user) => {
		if (user.attributes && user.attributes.password) {
			user.attributes.password = bcryptService().updatePassword(
				user.attributes.password
			);
		}
	});

	return users;
};
