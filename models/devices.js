'use strict';
const models = require('../models');
module.exports = (sequelize, DataTypes) =>
{
    const Device = sequelize.define('Device', {
        // attributes
        Name: DataTypes.STRING,
        Model: DataTypes.STRING,
        Serial: DataTypes.STRING,
        ImportDate: DataTypes.STRING,
        OperationDate: DataTypes.STRING,
        InstallationDate: DataTypes.STRING
    }, {});
    
    Device.associate = function (models) {
        // associations can be defined here
        Device.hasMany(models.WorkOrder);
        Device.belongsTo(models.Department, {
            foreignKey: 'department',
        });
    };
    
    return Device;
};