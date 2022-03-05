'use strict';

const Department = require('../models').Department;
module.exports = (sequelize, DataTypes) =>
{
    const Device = sequelize.define('Device', {
        // attributes
        Name: DataTypes.STRING,
        Manufacturer: DataTypes.STRING,
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
    Device.getDepartmentCount = () => Device.findAll({
        include: Department,
        attributes: ['DepartmentId', [sequelize.fn('count', sequelize.col('DepartmentId')), 'count']],
        group: ['DepartmentId'],
        raw: true,
        order: sequelize.literal('count DESC')
    }).then(re => {
    });
    return Device;
};
