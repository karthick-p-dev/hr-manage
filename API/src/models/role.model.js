//import bcryptService from "../services/bcrypt.service";
module.exports = (sequelize, DataTypes) => {
    const roles = sequelize.define(
        "roles", {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            roleName: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true

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

    // users.associate = (models) => {
    // 	users.belongsTo(models.designations, {
    // 		foreignKey: "designationId",
    // 		allowNull: false,
    // 		constraints: false,
    // 	});
    // 	users.belongsTo(models.institutionTypes, {
    // 		foreignKey: "institutionTypeId",
    // 		allowNull: false,
    // 		constraints: false,
    // 	});
    // 	users.hasMany(models.userRoleScreenActivities, {
    // 		foreignKey: "userId",
    // 		allowNull: false,
    // 		constraints: false,
    // 	});

    // };

    // users.beforeCreate((user) => {

    // 	if (user && user.password) {
    // 		user.password = bcryptService().password(user.password);
    // 	}
    // });

    // users.beforeBulkUpdate((user) => {
    // 	if (user.attributes && user.attributes.password) {
    // 		user.attributes.password = bcryptService().updatePassword(
    // 			user.attributes.password
    // 		);
    // 	}
    // });

    return roles;
};