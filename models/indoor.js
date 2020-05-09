'use strict';
const models = require("../models");

module.exports = (sequelize, DataTypes) => {
    const Indoor = sequelize.define('Indoor', {
        firstName: DataTypes.STRING,
        lastName : DataTypes.STRING,
        birthday : DataTypes.DATE,
        SSN : DataTypes.UInt16,
        Role : DataTypes.BOOL,
        WorkHours : DataTypes.Int8
    }, {});

    Indoor.associate = function (models) {
        // associations can be defined here
        Indoor.belongsTo(models.devices, )
    };
    return Indoor;
};
