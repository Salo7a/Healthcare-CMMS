'use strict';
module.exports = (sequelize, DataTypes) => {
    const Devices = sequelize.define('Devices', {
        firstName: DataTypes.STRING
    }, {});
    Devices.associate = function (models) {
        // associations can be defined here
    };
    return Devices;
};