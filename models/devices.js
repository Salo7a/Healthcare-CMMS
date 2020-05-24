'use strict';
const models = require('../models');
module.exports = (sequelize, DataTypes) =>
{
    const Device = sequelize.define('Device', {
        // attributes
        Name: DataTypes.STRING,
        Model: DataTypes.STRING,
        Serial: {
            type: DataTypes.STRING,
            unique: true
        },
        ImportDate: DataTypes.STRING,
        InstallationDate: DataTypes.STRING,
        SupplyingCompany: DataTypes.STRING,
        ScrappingDate: DataTypes.STRING,
        LastDaily: DataTypes.DATE,
        LastPPM: DataTypes.DATE,
        PPMInterval: DataTypes.NUMBER
    });
    
    Device.associate = function (models) {
        // associations can be defined here
        Device.hasMany(models.WorkOrder);
        Device.belongsTo(models.Department);
        Device.hasMany(models.Parts);
        Device.hasMany(models.Notification);
    };
    
    return Device;
};
