'use strict';
const models = require("../models");

module.exports = (sequelize, DataTypes) => {
    const Indoor = sequelize.define('Indoor', {
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        birthday: DataTypes.DATEONLY,
        Role: DataTypes.BOOLEAN,
        email: DataTypes.STRING,
        phone: DataTypes.STRING
    }, {});

    Indoor.associate = function (models) {
        // associations can be defined here
        Indoor.hasMany(models.WorkOrder);
        Indoor.hasMany(models.Device);
        Indoor.belongsTo(models.Department);

    };

    return Indoor;
};
