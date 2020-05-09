'use strict';
module.exports = (sequelize, DataTypes) =>
{
    const Device = sequelize.define('Device', {
        // attributes
        Name: DataTypes.STRING,
        ModelNumber: DataTypes.STRING,
        SerialNumber: DataTypes.STRING,
        Department: DataTypes.STRING,
        InstallationDate: DataTypes.STRING
    }, {
        tableName: 'Device'
    });
    
    Device.associate = function (models) {
        // associations can be defined here
    };
    
    return Device;
};