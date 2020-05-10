'use strict';
const models = require("../models");

module.exports = (sequelize, DataTypes) => {
    const Indoor = sequelize.define('Indoor', {
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        birthday: DataTypes.DATEONLY,
        Role: DataTypes.BOOLEAN,
    }, {});

    Indoor.associate = function (models) {
        // associations can be defined here
        Indoor.belongsTo(models.Device)
    };
    return Indoor;
};
